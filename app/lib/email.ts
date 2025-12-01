import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';

// Create transporter based on configuration
async function createTransporter() {
  // Option 1: Use Ethereal Email for testing (no real credentials needed)
  if (process.env.USE_ETHEREAL_EMAIL === 'true') {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // Option 2: Use provided SMTP credentials
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Clean up the password - remove spaces and quotes (App Passwords often have spaces)
    const cleanPassword = process.env.SMTP_PASS.trim().replace(/\s+/g, '').replace(/^["']|["']$/g, '');
    const cleanUser = process.env.SMTP_USER.trim().replace(/^["']|["']$/g, '');
    
    // Check if this is Gmail or Google Workspace
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const isGmailOrWorkspace = smtpHost === 'smtp.gmail.com' || 
                                cleanUser.endsWith('@gmail.com') ||
                                cleanUser.includes('@devit.group') ||
                                (!process.env.SMTP_HOST && cleanUser.includes('@'));

    // Debug logging (only in development, don't log the full password)
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email config:', {
        user: cleanUser,
        passwordLength: cleanPassword.length,
        passwordFirstChars: cleanPassword.substring(0, 4) + '...',
        method: isGmailOrWorkspace ? 'Gmail/Google Workspace (service: gmail)' : 'Custom SMTP',
      });
    }

    // According to Nodemailer docs: https://nodemailer.com/usage/using-gmail
    // For Gmail/Google Workspace, use service: 'gmail' (simplest approach)
    if (isGmailOrWorkspace) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: cleanUser,
          pass: cleanPassword,
        },
      });
    } else {
      // Custom SMTP server
      const smtpPort = parseInt(process.env.SMTP_PORT || '587');
      return nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
          user: cleanUser,
          pass: cleanPassword,
        },
      });
    }
  }

  // No transporter available
  return null;
}

// Initialize transporter (will be null if no credentials)
let transporter: nodemailer.Transporter | null | undefined = undefined;
let transporterPromise: Promise<nodemailer.Transporter | null> | null = null;

// Get or create transporter (lazy initialization)
async function getTransporter(): Promise<nodemailer.Transporter | null> {
  // If already initialized, return it
  if (transporter !== undefined) {
    return transporter;
  }

  // If initialization is in progress, wait for it
  if (transporterPromise) {
    return transporterPromise;
  }

  // Start initialization
  transporterPromise = createTransporter()
    .then((trans) => {
      transporter = trans;
      if (transporter && process.env.USE_ETHEREAL_EMAIL === 'true') {
        console.log('📧 Using Ethereal Email for testing (emails won\'t be sent, check Ethereal inbox)');
      } else if (transporter) {
        console.log('📧 SMTP transporter initialized');
      } else {
        console.log('📧 No SMTP credentials found - emails will be logged to console');
      }
      return trans;
    })
    .catch((error) => {
      console.error('❌ Failed to initialize email transporter:', error);
      transporter = null;
      return null;
    });

  return transporterPromise;
}

export async function sendVerificationEmail(email: string, firstName: string, verificationToken: string) {
  try {
    const verificationUrl = `${process.env.APP_URL}/verify-email?token=${verificationToken}`;

    // Get transporter (will initialize if needed)
    const emailTransporter = await getTransporter();

    // Development mode - log if no transporter, otherwise send real email
    if (!emailTransporter) {
      console.log('\n=== EMAIL VERIFICATION (DEV MODE - NO SMTP) ===');
      console.log(`To: ${email}`);
      console.log(`Hi ${firstName}, please verify your email by clicking this link:`);
      console.log(verificationUrl);
      console.log('===============================================\n');
      return;
    }

    // Production mode - send actual email
    const templatePath = path.join(process.cwd(), 'app', 'templates', 'verification-email.html');
    let htmlTemplate = await fs.readFile(templatePath, 'utf-8');

    // Replace placeholders (use replaceAll to replace all occurrences)
    htmlTemplate = htmlTemplate
      .replaceAll('{{firstName}}', firstName)
      .replaceAll('{{verificationUrl}}', verificationUrl);

    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@example.com',
      to: email,
      subject: 'Verify your email address',
      html: htmlTemplate,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    
    // If using Ethereal Email, log the preview URL
    if (process.env.USE_ETHEREAL_EMAIL === 'true') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`✅ Verification email sent! Preview: ${previewUrl}`);
    } else {
      console.log(`✅ Verification email sent to ${email}`);
    }
  } catch (error: any) {
    console.error('❌ Error sending verification email:', error);
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      if (error.response?.includes('BadCredentials')) {
        throw new Error(
          'Gmail authentication failed. Please use an App Password instead of your regular password.\n' +
          'To generate an App Password:\n' +
          '1. Go to your Google Account settings\n' +
          '2. Enable 2-Step Verification\n' +
          '3. Go to App Passwords and generate one for "Mail"\n' +
          '4. Use the 16-character App Password in SMTP_PASS'
        );
      }
      throw new Error('Email authentication failed. Please check your SMTP credentials.');
    }
    
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}

export async function sendPasswordResetEmail(email: string, firstName: string, resetToken: string) {
  try {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    // Get transporter (will initialize if needed)
    const emailTransporter = await getTransporter();

    // Development mode - log if no transporter, otherwise send real email
    if (!emailTransporter) {
      console.log('\n=== PASSWORD RESET EMAIL (DEV MODE - NO SMTP) ===');
      console.log(`To: ${email}`);
      console.log(`Hi ${firstName}, please reset your password by clicking this link:`);
      console.log(resetUrl);
      console.log('===============================================\n');
      return;
    }

    // Production mode - send actual email
    const templatePath = path.join(process.cwd(), 'app', 'templates', 'password-reset-email.html');
    let htmlTemplate = await fs.readFile(templatePath, 'utf-8');

    // Replace placeholders (use replaceAll to replace all occurrences)
    htmlTemplate = htmlTemplate
      .replaceAll('{{firstName}}', firstName)
      .replaceAll('{{resetUrl}}', resetUrl)
      .replaceAll('{{email}}', email);

    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@example.com',
      to: email,
      subject: 'Reset Your Password',
      html: htmlTemplate,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    
    // If using Ethereal Email, log the preview URL
    if (process.env.USE_ETHEREAL_EMAIL === 'true') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`✅ Password reset email sent! Preview: ${previewUrl}`);
    } else {
      console.log(`✅ Password reset email sent to ${email}`);
    }
  } catch (error: any) {
    console.error('❌ Error sending password reset email:', error);
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication Details:', {
        smtpUser: process.env.SMTP_USER,
        passwordLength: process.env.SMTP_PASS?.length,
        errorCode: error.code,
        responseCode: error.responseCode,
        response: error.response,
      });
      
      if (error.response?.includes('BadCredentials')) {
        const errorMsg = 
          'Gmail/Google Workspace authentication failed.\n\n' +
          'Possible issues:\n' +
          '1. The App Password might be incorrect - try regenerating it\n' +
          '2. Make sure you\'re using an App Password (16 characters, no spaces), not your regular password\n' +
          '3. For Google Workspace accounts, your admin may need to enable App Passwords\n' +
          '4. Verify that 2-Step Verification is enabled on your account\n\n' +
          'To generate a new App Password:\n' +
          '1. Go to https://myaccount.google.com/apppasswords\n' +
          '2. Select "Mail" and "Other (Custom name)"\n' +
          '3. Enter a name like "Nodemailer"\n' +
          '4. Copy the 16-character password (remove spaces)\n' +
          '5. Update SMTP_PASS in your .env file';
        
        throw new Error(errorMsg);
      }
      throw new Error(`Email authentication failed (${error.responseCode}). Please check your SMTP credentials.`);
    }
    
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
}

export async function sendFormSubmissionEmail(
  toEmail: string,
  formTitle: string,
  submitterEmail: string,
  submissionData: Record<string, any>,
  dashboardUrl: string
) {
  try {
    // Format fields for email
    const fieldsHtml = Object.entries(submissionData)
      .map(([key, value]) => {
        // Format value (handle arrays, objects, etc.)
        let displayValue = value;
        if (Array.isArray(value)) {
          displayValue = value.join(', ');
        } else if (typeof value === 'object' && value !== null) {
          displayValue = JSON.stringify(value);
        }

        return `
          <div class="field">
            <span class="label">${key}</span>
            <div class="value">${displayValue}</div>
          </div>
        `;
      })
      .join('');

    // Get transporter (will initialize if needed)
    const emailTransporter = await getTransporter();

    // Development mode - log if no transporter
    if (!emailTransporter) {
      console.log('\n=== FORM SUBMISSION EMAIL (DEV MODE - NO SMTP) ===');
      console.log(`To: ${toEmail}`);
      console.log(`Form: ${formTitle}`);
      console.log(`From: ${submitterEmail}`);
      console.log('Data:', JSON.stringify(submissionData, null, 2));
      console.log('================================================\n');
      return;
    }

    // Production mode - send actual email
    const templatePath = path.join(process.cwd(), 'app', 'templates', 'submission-email.html');
    let htmlTemplate = await fs.readFile(templatePath, 'utf-8');

    // Replace placeholders (use replaceAll to replace all occurrences)
    htmlTemplate = htmlTemplate
      .replaceAll('{{formTitle}}', formTitle)
      .replaceAll('{{submitterEmail}}', submitterEmail)
      .replaceAll('{{submissionDate}}', new Date().toLocaleString())
      .replaceAll('{{fieldsHtml}}', fieldsHtml)
      .replaceAll('{{dashboardUrl}}', dashboardUrl);

    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@example.com',
      to: toEmail,
      subject: `New Submission: ${formTitle}`,
      html: htmlTemplate,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    
    // If using Ethereal Email, log the preview URL
    if (process.env.USE_ETHEREAL_EMAIL === 'true') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`✅ Form submission email sent! Preview: ${previewUrl}`);
    } else {
      console.log(`✅ Form submission email sent to ${toEmail}`);
    }
  } catch (error: any) {
    console.error('❌ Error sending form submission email:', error);
    // Don't throw here to avoid failing the submission if email fails
    // But log helpful messages
    if (error.code === 'EAUTH' && error.response?.includes('BadCredentials')) {
      console.error('💡 Tip: For Gmail, use an App Password instead of your regular password');
    }
  }
}
