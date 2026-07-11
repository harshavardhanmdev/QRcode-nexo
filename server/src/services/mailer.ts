import nodemailer from "nodemailer";
import { config } from "../config.js";

/**
 * SMTP is optional: without credentials the contact form still stores the
 * message in the database — nothing is silently lost. docs/09-smtp-email.md
 * walks the owner through creating a Gmail app password.
 */
const transport =
  config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASS
    ? nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT ?? 587,
        secure: (config.SMTP_PORT ?? 587) === 465,
        auth: { user: config.SMTP_USER, pass: config.SMTP_PASS },
      })
    : null;

export const mailerConfigured = transport !== null;

export async function sendContactMail(msg: {
  name: string;
  email: string;
  message: string;
}): Promise<boolean> {
  if (!transport) return false;
  try {
    await transport.sendMail({
      from: config.SMTP_FROM ?? config.SMTP_USER,
      to: config.CONTACT_TO,
      replyTo: msg.email,
      subject: `[qrdock contact] ${msg.name}`,
      text: `From: ${msg.name} <${msg.email}>\n\n${msg.message}`,
    });
    return true;
  } catch {
    return false;
  }
}
