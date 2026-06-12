import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0f1e; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #111827; border-radius: 16px; overflow: hidden; border: 1px solid rgba(79,142,247,0.2); }
    .header { background: linear-gradient(135deg, #1e3a5f, #4f8ef7); padding: 30px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 24px; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; }
    .body { padding: 30px; color: #e2e8f0; }
    .score-badge { display: inline-block; padding: 8px 20px; border-radius: 50px; font-size: 22px; font-weight: bold; margin: 16px 0; }
    .score-high { background: linear-gradient(135deg, #10b981, #059669); color: white; }
    .score-mid { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
    .score-low { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
    .info-row { display: flex; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .info-label { color: #94a3b8; min-width: 140px; }
    .info-value { color: #f1f5f9; font-weight: 500; }
    .cta-button { display: inline-block; margin: 20px 0; padding: 14px 28px; background: linear-gradient(135deg, #4f8ef7, #a855f7); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { padding: 20px 30px; background: rgba(0,0,0,0.3); text-align: center; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <p>This email was sent by the AI-Powered ATS System. © ${new Date().getFullYear()}</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Send application confirmation email to candidate
 */
export const sendApplicationConfirmation = async ({ candidateEmail, candidateName, jobTitle, applicationId }) => {
  if (!process.env.EMAIL_USER) return; // Skip if not configured

  const transporter = createTransporter();
  const html = baseTemplate(`
    <div class="header">
      <h1> Application Received</h1>
      <p>We've received your application!</p>
    </div>
    <div class="body">
      <p>Hi <strong>${candidateName}</strong>,</p>
      <p>Thank you for applying for the <strong>${jobTitle}</strong> position. Your application has been successfully submitted and is currently being reviewed by our AI-powered screening system.</p>
      <div class="info-row">
        <span class="info-label">Application ID</span>
        <span class="info-value">#${applicationId}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Position</span>
        <span class="info-value">${jobTitle}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Status</span>
        <span class="info-value">Under Review</span>
      </div>
      <p style="margin-top: 20px; color: #94a3b8;">You will receive updates as your application progresses through the hiring pipeline. Our team will be in touch soon.</p>
    </div>
  `);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: candidateEmail,
    subject: `Application Received: ${jobTitle}`,
    html,
  });
};

/**
 * Send status update email to candidate
 */
export const sendStatusUpdateEmail = async ({ candidateEmail, candidateName, jobTitle, newStatus, score }) => {
  if (!process.env.EMAIL_USER) return;

  const statusMessages = {
    screening: { emoji: '', message: 'Your application is moving to the screening phase.', color: '#f59e0b' },
    interview: { emoji: '', message: 'Congratulations! You\'ve been selected for an interview.', color: '#10b981' },
    offer: { emoji: '', message: 'Exciting news! We have an offer for you.', color: '#10b981' },
    hired: { emoji: '', message: 'Welcome to the team!', color: '#10b981' },
    rejected: { emoji: '', message: 'Thank you for your interest. We\'ve decided to move forward with other candidates.', color: '#ef4444' },
  };

  const statusInfo = statusMessages[newStatus] || { emoji: '', message: 'Your application status has been updated.', color: '#4f8ef7' };
  const scoreClass = score >= 70 ? 'score-high' : score >= 45 ? 'score-mid' : 'score-low';
  const transporter = createTransporter();

  const html = baseTemplate(`
    <div class="header" style="background: linear-gradient(135deg, #1e3a5f, ${statusInfo.color});">
      <h1>${statusInfo.emoji} Application Update</h1>
      <p>${jobTitle}</p>
    </div>
    <div class="body">
      <p>Hi <strong>${candidateName}</strong>,</p>
      <p>${statusInfo.message}</p>
      <div class="info-row">
        <span class="info-label">New Status</span>
        <span class="info-value" style="color: ${statusInfo.color}; font-weight: bold;">${newStatus.toUpperCase()}</span>
      </div>
      ${score ? `<div class="info-row">
        <span class="info-label">ATS Score</span>
        <span class="info-value"><span class="score-badge ${scoreClass}">${score}/100</span></span>
      </div>` : ''}
    </div>
  `);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: candidateEmail,
    subject: `Application Update: ${jobTitle} — ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
    html,
  });
};
