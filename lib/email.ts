import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/verify/${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; overflow: hidden; }
        .header { background: linear-gradient(135deg, #00f2ff, #0066ff); padding: 40px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; color: #0f172a; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 40px; text-align: center; }
        .content p { line-height: 1.6; font-size: 16px; color: #94a3b8; }
        .btn { display: inline-block; padding: 16px 32px; background: #00f2ff; color: #0f172a; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 24px; box-shadow: 0 0 20px rgba(0, 242, 255, 0.4); }
        .fallback { margin-top: 32px; font-size: 12px; color: #64748b; word-break: break-all; }
        .footer { padding: 20px; text-align: center; border-top: 1px solid #334155; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NEON NEXUS</h1>
        </div>
        <div class="content">
          <h2>Verify Your Identity</h2>
          <p>Welcome to the Nexus. To activate your account and begin your digital journey, please verify your email address by clicking the button below.</p>
          <a href="${verificationUrl}" class="btn">ACTIVATE ACCOUNT</a>
          <p class="fallback">Or copy and paste this link in your browser:<br>${verificationUrl}</p>
        </div>
        <div class="footer">
          &copy; 2024 Neon Nexus Marketplace. All rights reserved.<br>
          Cyberpunk Top-Up Solutions.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verify Your Neon Nexus Account',
      text: `Verify your account by visiting: ${verificationUrl}`,
      html: html,
    });
    console.log(`[EMAIL] Verification sent to ${email}`);
    return true;
  } catch (error) {
    console.error('[EMAIL] Failed to send verification email:', error);
    return false;
  }
}
