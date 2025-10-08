import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';

// Only create transporter if SMTP credentials are provided
const transporter = process.env.SMTP_USER && process.env.SMTP_PASS 
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export async function sendVerificationEmail(email: string, firstName: string, verificationToken: string) {
  try {
    const verificationUrl = `${process.env.APP_URL}/verify-email?token=${verificationToken}`;
    
    // Development mode - just log the verification link
    if (!transporter || process.env.NODE_ENV === 'development') {
      console.log('\n=== EMAIL VERIFICATION (DEV MODE) ===');
      console.log(`To: ${email}`);
      console.log(`Hi ${firstName}, please verify your email by clicking this link:`);
      console.log(verificationUrl);
      console.log('=====================================\n');
      return;
    }

    // Production mode - send actual email
    const templatePath = path.join(process.cwd(), 'app', 'templates', 'verification-email.html');
    let htmlTemplate = await fs.readFile(templatePath, 'utf-8');
    
    // Replace placeholders
    htmlTemplate = htmlTemplate
      .replace('{{firstName}}', firstName)
      .replace('{{verificationUrl}}', verificationUrl);

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Verify your email address',
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}
