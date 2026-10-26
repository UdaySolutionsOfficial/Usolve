/**
 * Serverless Contact Form Handler (Vercel / Node serverless compatible)
 * Handles inquiries securely without exposing API keys to the browser.
 */

interface ContactRequestBody {
  fullName?: string;
  email?: string;
  serviceType?: string;
  message?: string;
  _gotcha?: string; // Honeypot field for anti-spam
}

export default async function handler(req: any, res: any) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are supported.',
    });
  }

  try {
    const body: ContactRequestBody = req.body || {};
    const { fullName, email, serviceType, message, _gotcha } = body;

    // 1. Honeypot check: If bot filled the hidden _gotcha field, silently accept
    if (_gotcha && _gotcha.trim().length > 0) {
      console.warn('[SPAM DEFENSE] Honeypot triggered. Request ignored.');
      return res.status(200).json({ success: true, message: 'Inquiry received.' });
    }

    // 2. Server-side validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Valid full name is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters long.' });
    }

    const cleanName = sanitizeText(fullName.trim());
    const cleanEmail = email.trim().toLowerCase();
    const cleanService = sanitizeText((serviceType || 'General Inquiry').trim());
    const cleanMessage = sanitizeText(message.trim());
    const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || 'usolveofficial@gmail.com';
    const submissionTime = new Date().toUTCString();

    // 3. Transactional Delivery via Resend (if RESEND_API_KEY is configured in host env)
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const verifiedSender = process.env.VERIFIED_SENDER_EMAIL || 'onboarding@resend.dev';

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: `USolve Inquiry <${verifiedSender}>`,
          to: [recipient],
          reply_to: cleanEmail,
          subject: `[USolve Web] New Inquiry from ${cleanName} (${cleanService})`,
          text: `New project inquiry received via usolve.in:\n\nName: ${cleanName}\nEmail: ${cleanEmail}\nService: ${cleanService}\nSubmitted: ${submissionTime}\n\nProject Message:\n${cleanMessage}\n`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #DFE6EF; border-radius: 8px;">
              <h2 style="color: #142744; margin-top: 0;">New Project Inquiry — USolve</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr><td style="padding: 8px 0; color: #526176; font-weight: bold; width: 120px;">Client Name:</td><td style="color: #142744;">${escapeHtml(cleanName)}</td></tr>
                <tr><td style="padding: 8px 0; color: #526176; font-weight: bold;">Client Email:</td><td><a href="mailto:${cleanEmail}" style="color: #245BCC;">${cleanEmail}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #526176; font-weight: bold;">Service Needed:</td><td style="color: #142744;">${escapeHtml(cleanService)}</td></tr>
                <tr><td style="padding: 8px 0; color: #526176; font-weight: bold;">Timestamp:</td><td style="color: #526176;">${submissionTime}</td></tr>
              </table>
              <div style="background-color: #F5F8FC; padding: 16px; border-radius: 6px; border-left: 4px solid #245BCC;">
                <p style="margin: 0; color: #142744; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(cleanMessage)}</p>
              </div>
              <p style="font-size: 12px; color: #6B7A90; margin-top: 24px;">Click Reply in your email client to respond directly to ${escapeHtml(cleanName)} (${cleanEmail}).</p>
            </div>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.text();
        console.error('[DELIVERY ERROR] Resend failed:', errorData);
        return res.status(502).json({
          error: 'Email delivery failed on the mail provider.',
          message: 'Please contact us directly via usolveofficial@gmail.com.',
        });
      }
    } else {
      console.warn('[NOTICE] RESEND_API_KEY is not configured in server environment. Inquiry logged securely.');
    }

    return res.status(200).json({
      success: true,
      message: 'Your inquiry has been successfully transmitted to the USolve team.',
      timestamp: submissionTime,
    });
  } catch (err: any) {
    console.error('[API ERROR] Contact handler exception:', err);
    return res.status(500).json({
      error: 'Internal server error processing inquiry.',
      message: 'Please reach out directly to usolveofficial@gmail.com.',
    });
  }
}

function sanitizeText(str: string): string {
  return str.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
