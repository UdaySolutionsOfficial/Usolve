/**
 * Serverless Confirmation Email Relay (Vercel Node Serverless Function)
 * 
 * Securely forwards contact confirmation requests to the authorized
 * Google Apps Script Web App without exposing the shared secret to browser JavaScript.
 */

interface SendConfirmationBody {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
  _gotcha?: string;
}

export default async function handler(req: any, res: any) {
  // 1. Enforce POST method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
      message: 'Only POST requests are permitted.'
    });
  }

  // 2. Request body size check (max 32KB)
  const rawBodyString = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  if (rawBodyString.length > 32768) {
    return res.status(413).json({
      success: false,
      error: 'Payload Too Large',
      message: 'Request payload exceeds the permitted size limit (32KB).'
    });
  }

  try {
    const body: SendConfirmationBody = typeof req.body === 'object' && req.body !== null ? req.body : {};
    const { name, email, service, message, _gotcha } = body;

    // 3. Honeypot check (defense in depth for automated spam bots)
    if (_gotcha && typeof _gotcha === 'string' && _gotcha.trim().length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Confirmation received.'
      });
    }

    // 4. Validate input fields
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Name is required and must be between 2 and 100 characters.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim()) || email.trim().length > 150) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'A valid email address is required.'
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 5000) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Message must be between 10 and 5000 characters.'
      });
    }

    const cleanName = sanitizeText(name.trim());
    const cleanEmail = email.trim().toLowerCase();
    const cleanService = sanitizeText((service || 'Website Design & Development').trim());
    const cleanMessage = sanitizeText(message.trim());

    // 5. Server-side environment secrets (never exposed to browser)
    const appsScriptUrl = process.env.USOLVE_APPS_SCRIPT_URL?.trim();
    const sharedSecret = process.env.USOLVE_EMAIL_SHARED_SECRET?.trim();

    if (!appsScriptUrl || !sharedSecret) {
      // Configuration notice: Return 503 without revealing secret details
      return res.status(503).json({
        success: false,
        error: 'Service Unavailable',
        message: 'Confirmation email service is pending server configuration.'
      });
    }

    // 6. Forward authenticated request to Google Apps Script Web App
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const scriptResponse = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        secret: sharedSecret,
        name: cleanName,
        email: cleanEmail,
        service: cleanService,
        message: cleanMessage,
        _gotcha: _gotcha || '',
      }),
      signal: controller.signal,
      redirect: 'follow', // Follow 302 redirect from Google Apps Script
    });

    clearTimeout(timeoutId);

    const scriptData: any = await scriptResponse.json().catch(() => null);

    if (scriptResponse.ok && scriptData && scriptData.success) {
      return res.status(200).json({
        success: true,
        message: `Confirmation email dispatched to ${cleanEmail}.`,
        timestamp: scriptData.timestamp || new Date().toISOString(),
      });
    } else {
      const errorMessage = scriptData?.message || scriptData?.error || 'Failed to dispatch confirmation email.';
      return res.status(scriptResponse.status || 502).json({
        success: false,
        error: 'Confirmation Dispatch Failed',
        message: errorMessage,
      });
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return res.status(504).json({
        success: false,
        error: 'Gateway Timeout',
        message: 'The confirmation email service took too long to respond.',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Unable to communicate with the confirmation email service.',
    });
  }
}

function sanitizeText(str: string): string {
  return str.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '');
}
