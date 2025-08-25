import 'dotenv/config';
import transporter from './config/emailConfig.js';

async function testEmail() {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // send test to yourself
      subject: 'Test Email',
      text: 'Hello! Nodemailer test successful.',
    });
    console.log('✅ Email sent successfully');
  } catch (error) {
    console.error('❌ Email failed:', error);
  }
}

testEmail();
