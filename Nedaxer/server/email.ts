import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Configure transporter for Zoho Mail
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASSWORD || '',
    },
    // Use appropriate TLS options
    tls: {
      rejectUnauthorized: process.env.NODE_ENV !== 'development',
      minVersion: 'TLSv1.2',
      ciphers: 'HIGH:MEDIUM:!aNULL:!MD5:!RC4'
    },
    // Enable logging in development mode
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development'
  });
};

// Load the email template (with placeholders)
const loadTemplate = (fileName: string, replacements: Record<string, string> = {}): string => {
  const filePath = path.join(process.cwd(), 'emails', fileName);
  try {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Replace all placeholders with their corresponding values
    Object.entries(replacements).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    
    return html;
  } catch (error) {
    console.error(`Error loading email template ${fileName}:`, error);
    return `Failed to load email template: ${fileName}`;
  }
};

// Send email function
export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  replacements: Record<string, string> = {}
): Promise<void> => {
  try {
    // Add current year to replacements if not already included
    if (!replacements.current_year) {
      replacements.current_year = new Date().getFullYear().toString();
    }
    
    const htmlContent = loadTemplate(templateName, replacements);
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Nedaxer Team <noreply@nedaxer.com>',
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    
    // In development, don't throw the error - just log it
    if (process.env.NODE_ENV === 'development') {
      console.log(`Development mode: Email would have been sent to ${to} with template ${templateName}`);
      console.log('Replacements:', replacements);
    } else {
      // Convert to a proper Error object to access message
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }
};

// Helper functions for specific email types
export const sendVerificationEmail = async (
  email: string, 
  verificationCode: string, 
  firstName: string
): Promise<void> => {
  return sendEmail(
    email,
    'Verify Your Account - Nedaxer',
    'verification.html',
    {
      verification_code: verificationCode,
      first_name: firstName
    }
  );
};

export const sendWelcomeEmail = async (
  email: string, 
  firstName: string
): Promise<void> => {
  const loginLink = `${process.env.APP_URL || 'http://localhost:5000'}/login`;
  
  return sendEmail(
    email,
    'Welcome to Nedaxer - Your Account is Now Active!',
    'welcome.html',
    {
      login_link: loginLink,
      first_name: firstName
    }
  );
};

export const sendPasswordResetEmail = async (
  email: string,
  resetCode: string,
  firstName: string
): Promise<void> => {
  return sendEmail(
    email,
    'Reset Your Password - Nedaxer',
    'password-reset.html',
    {
      reset_code: resetCode,
      first_name: firstName
    }
  );
};