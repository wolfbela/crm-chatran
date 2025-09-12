import nodemailer from "nodemailer";
import { EMAIL_CONFIG, SMTP_CONFIG } from "./constants";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const createTransporter = () => {
  const host = process.env.SMTP_HOST || SMTP_CONFIG.DEFAULTS.HOST;
  const port = parseInt(process.env.SMTP_PORT || SMTP_CONFIG.DEFAULTS.PORT);
  const secure = process.env.SMTP_SECURE === "true";

  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error(
      "SMTP_USER and SMTP_PASSWORD environment variables are required",
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export async function sendEmail({
  to,
  subject,
  html,
}: EmailOptions): Promise<void> {
  if (!to || !subject || !html) {
    throw new Error("Email parameters (to, subject, html) are required");
  }

  try {
    const transporter = createTransporter();
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

    const mailOptions = {
      from: `${EMAIL_CONFIG.FROM_NAME} <${fromEmail}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Email sending failed to ${to}:`, error);
    throw new Error(
      `Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
