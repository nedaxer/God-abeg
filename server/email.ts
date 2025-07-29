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
    // Enhanced TLS options for better deliverability
    tls: {
      rejectUnauthorized: process.env.NODE_ENV !== 'development',
    },
    // Connection options for reliability
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000, // 30 seconds
    socketTimeout: 60000, // 60 seconds
    // Enable logging in development mode
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development',
  } as any);
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
      from: process.env.EMAIL_FROM || 'Nedaxer Team <nedaxerinvestments.com@zohomail.com>',
      to,
      subject,
      html: htmlContent,
      // Add headers to improve deliverability and avoid spam
      headers: {
        'X-Mailer': 'Nedaxer Platform',
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'Reply-To': process.env.EMAIL_FROM || 'nedaxerinvestments.com@zohomail.com',
        'List-Unsubscribe': '<mailto:unsubscribe@nedaxer.com>',
        'Organization': 'Nedaxer Inc',
        'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN',
        'Message-ID': `<${Date.now()}-${Math.random().toString(36).substr(2, 9)}@nedaxer.com>`
      },
      // Add text version for better deliverability
      text: `
Nedaxer Account Verification

Thank you for creating an account with Nedaxer. To activate your account, please use the verification code below:

Verification Code: ${replacements.verification_code || '[CODE]'}

This code will expire in 3 minutes for security reasons.

If you didn't sign up for Nedaxer, you can safely ignore this message.

Best regards,
The Nedaxer Team
www.nedaxer.com

© ${new Date().getFullYear()} Nedaxer Inc. All rights reserved.
      `.trim()
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
  firstName: string = 'User'
): Promise<void> => {
  return sendEmail(
    email,
    'Password Reset Code - Nedaxer',
    'password-reset.html',
    {
      reset_code: resetCode,
      first_name: firstName,
      current_year: new Date().getFullYear().toString()
    }
  );
};

// Send deposit confirmation email to user
export const sendDepositConfirmationEmail = async (
  email: string,
  firstName: string,
  depositAmount: string,
  cryptoSymbol: string,
  usdAmount: string,
  depositAddress: string,
  networkType: string
): Promise<void> => {
  const loginLink = `${process.env.APP_URL || 'http://localhost:5000'}/mobile`;
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  // Format crypto amount to remove trailing zeros
  const formattedCryptoAmount = parseFloat(depositAmount).toFixed(6);

  // Format USD amount with commas
  const formattedUsdAmount = parseFloat(usdAmount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return sendEmail(
    email,
    'Deposit Confirmed - Nedaxer',
    'deposit-confirmation.html',
    {
      first_name: firstName,
      deposit_amount: formattedCryptoAmount,
      crypto_symbol: cryptoSymbol,
      usd_amount: formattedUsdAmount,
      deposit_address: depositAddress,
      network_type: networkType,
      confirmation_timestamp: timestamp,
      login_link: loginLink
    }
  );
};;

// Send admin notification for deposit submission
export const sendAdminDepositNotification = async (
  userDetails: any,
  depositDetails: any,
  receiptAttachment?: Buffer
): Promise<void> => {
  const adminEmail = 'leesmart995@gmail.com';
  const adminDashboardUrl = `${process.env.APP_URL || 'http://localhost:5000'}/admin/dashboard`;

  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const verificationStatus = userDetails.isVerified ? 'Verified ✓' : 'Unverified ⚠️';
  const registrationDate = userDetails.createdAt ? 
    new Date(userDetails.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Unknown';

  const replacements = {
    user_uid: userDetails.uid || userDetails._id,
    user_full_name: `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || userDetails.username || 'Unknown',
    user_email: userDetails.email || 'Unknown',
    user_phone: userDetails.phoneNumber || 'Not provided',
    user_verification_status: verificationStatus,
    user_registration_date: registrationDate,
    deposit_amount: depositDetails.amount || 'Unknown',
    crypto_symbol: depositDetails.cryptoSymbol || 'Unknown',
    usd_amount: depositDetails.usdAmount || 'Unknown',
    network_type: depositDetails.networkType || 'Unknown',
    deposit_address: depositDetails.depositAddress || 'Unknown',
    submission_timestamp: timestamp,
    admin_dashboard_url: adminDashboardUrl
  };

  try {
    const htmlContent = loadTemplate('admin-deposit-notification.html', replacements);
    const transporter = createTransporter();

    const mailOptions: any = {
      from: process.env.EMAIL_FROM || 'Nedaxer Team <nedaxerinvestments.com@zohomail.com>',
      to: adminEmail,
      subject: `🚨 New Deposit Submission - ${userDetails.firstName || userDetails.username || 'User'} - $${depositDetails.usdAmount || 'Unknown'} USD`,
      html: htmlContent,
      headers: {
        'X-Mailer': 'Nedaxer Admin System',
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'Reply-To': process.env.EMAIL_FROM || 'nedaxerinvestments.com@zohomail.com',
        'Organization': 'Nedaxer Inc',
        'Message-ID': `<${Date.now()}-${Math.random().toString(36).substr(2, 9)}@nedaxer.com>`
      }
    };

    // Attach receipt if provided
    if (receiptAttachment) {
      mailOptions.attachments = [{
        filename: `deposit-receipt-${userDetails.uid || 'user'}-${Date.now()}.jpg`,
        content: receiptAttachment,
        contentType: 'image/jpeg'
      }];
    }

    await transporter.sendMail(mailOptions);
    console.log(`Admin notification sent successfully for deposit submission by ${userDetails.email}`);
  } catch (error) {
    console.error('Error sending admin deposit notification:', error);
    throw new Error(`Failed to send admin notification: ${error}`);
  }
};

// Send transfer notification emails
export const sendTransferSentEmail = async (
  email: string,
  firstName: string,
  amount: string,
  recipientName: string,
  transactionId: string
): Promise<void> => {
  const loginLink = `${process.env.APP_URL || 'http://localhost:5000'}/mobile`;
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  // Format amount with commas
  const formattedAmount = parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return sendEmail(
    email,
    'Transfer Sent - Nedaxer',
    'transfer-sent.html',
    {
      first_name: firstName,
      transfer_amount: formattedAmount,
      recipient_name: recipientName,
      transaction_id: transactionId,
      transfer_timestamp: timestamp,
      login_link: loginLink
    }
  );
};

export const sendTransferReceivedEmail = async (
  email: string,
  firstName: string,
  amount: string,
  senderName: string,
  transactionId: string
): Promise<void> => {
  const loginLink = `${process.env.APP_URL || 'http://localhost:5000'}/mobile`;
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  // Format amount with commas
  const formattedAmount = parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return sendEmail(
    email,
    'Transfer Received - Nedaxer',
    'transfer-received.html',
    {
      first_name: firstName,
      transfer_amount: formattedAmount,
      sender_name: senderName,
      transaction_id: transactionId,
      transfer_timestamp: timestamp,
      login_link: loginLink
    }
  );
};

// Send withdrawal confirmation email to user
export const sendWithdrawalConfirmationEmail = async (
  email: string,
  firstName: string,
  withdrawalAmount: string,
  cryptoSymbol: string,
  usdAmount: string,
  withdrawalAddress: string,
  networkType: string
): Promise<void> => {
  const loginLink = `${process.env.APP_URL || 'http://localhost:5000'}/mobile`;
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  // Format crypto amount to remove trailing zeros
  const formattedCryptoAmount = parseFloat(withdrawalAmount).toFixed(6);

  // Format USD amount with commas
  const formattedUsdAmount = parseFloat(usdAmount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return sendEmail(
    email,
    'Withdrawal Successful - Nedaxer',
    'withdrawal-confirmation.html',
    {
      first_name: firstName,
      withdrawal_amount: formattedCryptoAmount,
      crypto_symbol: cryptoSymbol,
      usd_amount: formattedUsdAmount,
      withdrawal_address: withdrawalAddress,
      network_type: networkType,
      confirmation_timestamp: timestamp,
      login_link: loginLink
    }
  );
};