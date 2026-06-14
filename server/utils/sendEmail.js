import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Using a test SMTP service for development if no real SMTP is provided
  // In production, configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER || 'your_smtp_user',
      pass: process.env.SMTP_PASS || 'your_smtp_password',
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'CandidateToHR'} <${process.env.FROM_EMAIL || 'noreply@candidatetohr.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
