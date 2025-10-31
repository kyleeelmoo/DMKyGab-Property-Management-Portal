const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendVerificationCode(email, code, type = 'registration') {
    const subject = type === 'registration' 
      ? 'DMKyGab Portal - Email Verification Code'
      : 'DMKyGab Portal - Login Verification Code';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .code-box { background: white; border: 2px solid #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #667eea; margin: 20px 0; border-radius: 5px; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏢 DMKyGab Property Management</h1>
          </div>
          <div class="content">
            <h2>Email Verification</h2>
            <p>Hello,</p>
            <p>Your verification code for ${type} is:</p>
            <div class="code-box">${code}</div>
            <p>This code will expire in ${process.env.VERIFICATION_CODE_EXPIRY || 15} minutes.</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If you didn't request this code, please ignore this email.
            </div>
            <p>Thank you for using DMKyGab Property Management Portal!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 DMKyGab Property Management. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"DMKyGab Portal" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: html,
      });
      console.log(`Verification code sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendAdminNotification(userDetails) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; }
          .info-row { padding: 8px 0; border-bottom: 1px solid #eee; }
          .info-label { font-weight: bold; color: #667eea; }
          .action-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New User Registration</h1>
          </div>
          <div class="content">
            <h2>Pending Approval Required</h2>
            <p>A new user has registered and requires admin approval:</p>
            <div class="info-box">
              <div class="info-row">
                <span class="info-label">Name:</span> ${userDetails.name}
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span> ${userDetails.email}
              </div>
              <div class="info-row">
                <span class="info-label">Phone:</span> ${userDetails.phone || 'N/A'}
              </div>
              <div class="info-row">
                <span class="info-label">Role:</span> ${userDetails.role}
              </div>
              <div class="info-row">
                <span class="info-label">Registration Date:</span> ${new Date().toLocaleString()}
              </div>
            </div>
            <p>Please log in to the admin panel to approve or reject this registration.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="action-button">Go to Admin Panel</a>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"DMKyGab Portal" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: 'New User Registration - Approval Required',
        html: html,
      });
      console.log('Admin notification sent');
      return true;
    } catch (error) {
      console.error('Error sending admin notification:', error);
      // Don't throw error here, just log it
      return false;
    }
  }

  async sendApprovalNotification(email, approved) {
    const subject = approved 
      ? 'Your DMKyGab Portal Account Has Been Approved'
      : 'Your DMKyGab Portal Account Registration';

    const html = approved ? `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .success-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; }
          .action-button { display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Account Approved!</h1>
          </div>
          <div class="content">
            <div class="success-box">
              <strong>Good news!</strong> Your DMKyGab Portal account has been approved by the administrator.
            </div>
            <p>You can now log in and start using the portal.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="action-button">Login Now</a>
          </div>
        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .info-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📝 Registration Received</h1>
          </div>
          <div class="content">
            <div class="info-box">
              Your registration has been received and is pending administrator approval.
            </div>
            <p>You will receive an email notification once your account has been reviewed.</p>
            <p>Thank you for your patience!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"DMKyGab Portal" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: html,
      });
      return true;
    } catch (error) {
      console.error('Error sending approval notification:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
