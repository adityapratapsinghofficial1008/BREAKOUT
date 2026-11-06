import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Email via Brevo (formerly Sendinblue) SMTP.
 *
 * WHY BREVO:
 *   - Free tier: 300 emails/day, sends to ANY email address (not just verified ones)
 *   - SMTP host: smtp-relay.brevo.com  port: 587  (works on Render, Railway, Fly.io)
 *   - No domain ownership required on the free tier
 *
 * HOW TO GET CREDENTIALS:
 *   1. Sign up free at https://app.brevo.com
 *   2. Go to: Account → SMTP & API → SMTP tab
 *   3. Copy the Login (your email) and Master Password shown there
 *   4. Paste into Server/.env as BREVO_USER and BREVO_PASS
 */

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.BREVO_USER;
  const pass = process.env.BREVO_PASS;

  if (user && pass) {
    transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // STARTTLS
      auth: { user, pass }
    });
  } else {
    // Dev fallback — no credentials needed, links print to console
    transporter = nodemailer.createTransport({ jsonTransport: true });
  }

  return transporter;
}

export async function sendVerificationEmail({ toEmail, name, verificationToken, clientUrl }) {
  const verifyUrl = `${clientUrl || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;

  // Always log the link — handy in dev without any SMTP config
  console.log(`\n======================================================`);
  console.log(`✉️  VERIFICATION EMAIL → ${toEmail}`);
  console.log(`🔗 LINK: ${verifyUrl}`);
  console.log(`======================================================\n`);

  const mailer = getTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || '"BREAKOUT" <no-reply@breakout.app>',
    to: toEmail,
    subject: 'Verify your BREAKOUT account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0a0a0a; color: #ffffff; border: 1px solid #262626;">
        <div style="font-size: 20px; font-weight: 800; letter-spacing: 2px; margin-bottom: 24px; color: #ffffff;">
          BREAKOUT <span style="font-size: 12px; color: #f59e0b;">// VERIFICATION</span>
        </div>
        <p style="font-size: 15px; color: #d4d4d4;">Hello ${name || 'Learner'},</p>
        <p style="font-size: 14px; color: #a3a3a3; line-height: 1.6;">
          Thank you for signing up for BREAKOUT. Please verify your email address to activate your account.
        </p>
        <div style="margin: 32px 0;">
          <a href="${verifyUrl}" style="background: #ffffff; color: #0a0a0a; text-decoration: none; padding: 12px 24px; font-weight: bold; font-size: 13px; letter-spacing: 1px; display: inline-block;">
            VERIFY EMAIL ADDRESS
          </a>
        </div>
        <p style="font-size: 12px; color: #737373; line-height: 1.5;">
          Or copy and paste this URL into your browser:<br/>
          <a href="${verifyUrl}" style="color: #f59e0b; word-break: break-all;">${verifyUrl}</a>
        </p>
        <hr style="border: 0; border-top: 1px solid #262626; margin: 32px 0;" />
        <p style="font-size: 11px; color: #525252;">
          If you did not create an account with BREAKOUT, please disregard this email.
        </p>
      </div>
    `
  };

  const info = await mailer.sendMail(mailOptions);
  return { info, verifyUrl };
}
