import nodemailer from "nodemailer";
import { EMAIL_CONFIG } from "./constants";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "localhost",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
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
  const transporter = createTransporter();

  const mailOptions = {
    from: `${EMAIL_CONFIG.FROM_NAME} <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}
