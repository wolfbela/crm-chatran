"use server";

import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./database";
import { sendEmail } from "./email";
import {
  MESSAGES,
  AUTH_CONFIG,
  EMAIL_CONFIG,
  NAVIGATION_ROUTES,
} from "./constants";

const SALT_ROUNDS = 12;
const SESSION_COOKIE = "session_user_id";

interface AuthResult {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export async function registerUser(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!email || !password || !confirmPassword) {
    return {
      success: false,
      message: MESSAGES.ERROR.REQUIRED_FIELDS,
    };
  }

  if (!isValidEmail(email)) {
    return {
      success: false,
      message: MESSAGES.ERROR.INVALID_EMAIL,
    };
  }

  if (password.length < AUTH_CONFIG.PASSWORD_MIN_LENGTH) {
    return {
      success: false,
      message: MESSAGES.ERROR.WEAK_PASSWORD,
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: MESSAGES.ERROR.PASSWORDS_DONT_MATCH,
    };
  }

  try {
    const existingUser = await db
      .selectFrom("users")
      .select("id")
      .where("email", "=", email)
      .executeTakeFirst();

    if (existingUser) {
      return {
        success: false,
        message: MESSAGES.ERROR.EMAIL_ALREADY_EXISTS,
      };
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const confirmationToken = uuidv4();

    const user = await db
      .insertInto("users")
      .values({
        email,
        password: hashedPassword,
        confirmed: false,
        confirmation_token: confirmationToken,
      })
      .returning("id")
      .executeTakeFirstOrThrow();

    await sendConfirmationEmail(email, confirmationToken);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * AUTH_CONFIG.SESSION_DURATION_DAYS,
    });

    return {
      success: true,
      message: MESSAGES.SUCCESS.ACCOUNT_CREATED,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: MESSAGES.ERROR.GENERIC_ERROR,
    };
  }
}

export async function loginUser(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      success: false,
      message: MESSAGES.ERROR.REQUIRED_FIELDS,
    };
  }

  try {
    const user = await db
      .selectFrom("users")
      .select(["id", "password", "confirmed"])
      .where("email", "=", email)
      .executeTakeFirst();

    if (!user) {
      return {
        success: false,
        message: MESSAGES.ERROR.INVALID_CREDENTIALS,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: MESSAGES.ERROR.INVALID_CREDENTIALS,
      };
    }

    if (!user.confirmed) {
      return {
        success: false,
        message: MESSAGES.ERROR.ACCOUNT_NOT_CONFIRMED,
      };
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * AUTH_CONFIG.SESSION_DURATION_DAYS,
    });

    return {
      success: true,
      message: MESSAGES.SUCCESS.LOGIN_SUCCESS,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: MESSAGES.ERROR.GENERIC_ERROR,
    };
  }
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect(NAVIGATION_ROUTES.LOGIN);
}

export async function forgotPassword(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string;

  if (!email) {
    return {
      success: false,
      message: MESSAGES.ERROR.REQUIRED_FIELDS,
    };
  }

  try {
    const user = await db
      .selectFrom("users")
      .select("id")
      .where("email", "=", email)
      .executeTakeFirst();

    if (!user) {
      return {
        success: true,
        message: MESSAGES.SUCCESS.PASSWORD_RESET_EMAIL_SENT,
      };
    }

    const resetToken = uuidv4();
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(
      resetTokenExpires.getHours() + AUTH_CONFIG.TOKEN_EXPIRY_HOURS,
    );

    await db
      .updateTable("users")
      .set({
        reset_token: resetToken,
        reset_token_expires: resetTokenExpires,
      })
      .where("id", "=", user.id)
      .execute();

    await sendPasswordResetEmail(email, resetToken);

    return {
      success: true,
      message: MESSAGES.SUCCESS.PASSWORD_RESET_EMAIL_SENT,
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: MESSAGES.ERROR.EMAIL_SEND_ERROR,
    };
  }
}

export async function resetPassword(formData: FormData): Promise<AuthResult> {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!token || !password || !confirmPassword) {
    return {
      success: false,
      message: MESSAGES.ERROR.REQUIRED_FIELDS,
    };
  }

  if (password.length < AUTH_CONFIG.PASSWORD_MIN_LENGTH) {
    return {
      success: false,
      message: MESSAGES.ERROR.WEAK_PASSWORD,
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: MESSAGES.ERROR.PASSWORDS_DONT_MATCH,
    };
  }

  try {
    const user = await db
      .selectFrom("users")
      .select(["id", "reset_token_expires"])
      .where("reset_token", "=", token)
      .executeTakeFirst();

    if (!user || !user.reset_token_expires) {
      return {
        success: false,
        message: MESSAGES.ERROR.INVALID_TOKEN,
      };
    }

    if (user.reset_token_expires < new Date()) {
      return {
        success: false,
        message: MESSAGES.ERROR.INVALID_TOKEN,
      };
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await db
      .updateTable("users")
      .set({
        password: hashedPassword,
        reset_token: undefined,
        reset_token_expires: undefined,
      })
      .where("id", "=", user.id)
      .execute();

    return {
      success: true,
      message: MESSAGES.SUCCESS.PASSWORD_RESET_SUCCESS,
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: MESSAGES.ERROR.GENERIC_ERROR,
    };
  }
}

export async function confirmEmail(token: string): Promise<AuthResult> {
  if (!token) {
    return {
      success: false,
      message: MESSAGES.ERROR.INVALID_TOKEN,
    };
  }

  try {
    const user = await db
      .selectFrom("users")
      .select("id")
      .where("confirmation_token", "=", token)
      .executeTakeFirst();

    if (!user) {
      return {
        success: false,
        message: MESSAGES.ERROR.INVALID_TOKEN,
      };
    }

    await db
      .updateTable("users")
      .set({
        confirmed: true,
        confirmation_token: undefined,
      })
      .where("id", "=", user.id)
      .execute();

    return {
      success: true,
      message: MESSAGES.SUCCESS.EMAIL_CONFIRMED,
    };
  } catch (error) {
    console.error("Email confirmation error:", error);
    return {
      success: false,
      message: MESSAGES.ERROR.GENERIC_ERROR,
    };
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get(SESSION_COOKIE)?.value;

    if (!userId) {
      return null;
    }

    const user = await db
      .selectFrom("users")
      .select(["id", "email", "confirmed"])
      .where("id", "=", userId)
      .executeTakeFirst();

    return user || null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

async function sendConfirmationEmail(email: string, token: string) {
  const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${NAVIGATION_ROUTES.CONFIRM_EMAIL}?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Confirmez votre email</h1>
      <p>Merci de vous être inscrit sur Shidoukh. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
      <a href="${confirmUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Confirmer mon email</a>
      <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
      <p><a href="${confirmUrl}">${confirmUrl}</a></p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: EMAIL_CONFIG.SUBJECT.EMAIL_CONFIRMATION,
    html,
  });
}

async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${NAVIGATION_ROUTES.RESET_PASSWORD}?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Réinitialisation de mot de passe</h1>
      <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
      <a href="${resetUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Réinitialiser mon mot de passe</a>
      <p>Ce lien expire dans ${AUTH_CONFIG.TOKEN_EXPIRY_HOURS} heures.</p>
      <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: EMAIL_CONFIG.SUBJECT.PASSWORD_RESET,
    html,
  });
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
