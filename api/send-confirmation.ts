/**
 * Serverless Confirmation Email Relay (Vercel Node Serverless Function)
 * 
 * Securely validates and relays contact confirmation requests to the authorized
 * Google Apps Script Web App without exposing secrets to browser JavaScript.
 * 
 * Multi-Layered Security:
 * 1. Cloudflare Turnstile Verification (bot protection via TURNSTILE_SECRET_KEY)
 * 2. Origin / Referer Validation (cross-site submission filtering)
 * 3. Per-IP Rate Limiting (in-memory sliding window)
 * 4. Anti-spam Honeypot (_gotcha)
 * 5. Shared-Secret Authentication with Google Apps Script
 */

interface SendConfirmationBody {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
  _gotcha?: string;
  turnstileToken?: string;
}

// In-memory sliding window rate limiter
// NOTE ON SERVERLESS RATE LIMITING:
// In a serverless environment (such as Vercel Edge/Node functions), in-memory state is maintained
// per warm container instance and resets across cold starts. While not a substitute for a distributed
// database (e.g. Upstash Redis), it provides immediate defense against burst requests on warm instances.
// Cloudflare Turnstile, honeypot traps, origin checks, and Google Apps Script daily quotas provide
// the distributed, multi-layered defense.
const ipRequestHistory = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per 10 minutes per IP

function isRateLimited(ip: string): boolean {
  if (!ip) return false;
  const now = Date.now();
  const record = ipRequestHistory.get(ip);

  if (!record || now > record.resetTime) {
    ipRequestHistory.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count += 1;
  return false;
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

  // 3. Extract Client IP
  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIp = typeof forwardedFor === 'string'
    ? forwardedFor.split(',')[0].trim()
    : (req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown-ip');

  // 4. Per-IP Rate Limiting
  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: 'Multiple inquiries received from your connection. Please wait a few minutes before trying again.'
    });
  }

  // 5. Origin / Referer Validation (Defense in Depth)
  const origin = (req.headers['origin'] || req.headers['referer'] || '').toString();
  if (origin) {
    try {
      const originHost = new URL(origin).hostname.toLowerCase();
      const siteUrl = process.env.VITE_SITE_URL || 'https://usolve.in';
      const configuredHost = new URL(siteUrl).hostname.toLowerCase();

      const isAllowed =
        originHost === 'usolve.in' ||
        originHost === 'www.usolve.in' ||
        originHost === 'localhost' ||
        originHost === '127.0.0.1' ||
        originHost === configuredHost ||
        originHost.endsWith('.vercel.app');

      if (!isAllowed) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'Cross-origin request rejected.'
        });
      }
    } catch (_) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Invalid request origin header.'
      });
    }
  }

  try {
    const body: SendConfirmationBody = typeof req.body === 'object' && req.body !== null ? req.body : {};
    const { name, email, service, message, _gotcha, turnstileToken } = body;

    // 6. Anti-spam Honeypot Check (Silently drop bots without burning MailApp quota)
    if (_gotcha && typeof _gotcha === 'string' && _gotcha.trim().length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Confirmation received.'
      });
    }

    // 7. Cloudflare Turnstile Verification (if TURNSTILE_SECRET_KEY is configured on server)
    const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY?.trim();
    if (turnstileSecretKey) {
      if (!turnstileToken || typeof turnstileToken !== 'string' || turnstileToken.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Verification Required',
          message: 'Security challenge verification token is required.'
        });
      }

      try {
        const turnstileFormData = new URLSearchParams();
        turnstileFormData.append('secret', turnstileSecretKey);
        turnstileFormData.append('response', turnstileToken.trim());
        if (clientIp && clientIp !== 'unknown-ip') {
          turnstileFormData.append('remoteip', clientIp);
        }

        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          body: turnstileFormData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const turnstileResult: any = await verifyResponse.json().catch(() => null);

        if (!verifyResponse.ok || !turnstileResult || turnstileResult.success !== true) {
          return res.status(403).json({
            success: false,
            error: 'Security Verification Failed',
            message: 'Cloudflare security challenge could not be validated. Please refresh and try again.'
          });
        }
      } catch (turnstileErr) {
        console.error('[SECURITY ERROR] Turnstile verification exception:', turnstileErr);
        return res.status(502).json({
          success: false,
          error: 'Verification Service Unavailable',
          message: 'Unable to reach the security verification gateway.'
        });
      }
    }

    // 8. Validate Input Fields
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

    // 9. Server-Side Environment Secrets (Never exposed to browser)
    const appsScriptUrl = process.env.USOLVE_APPS_SCRIPT_URL?.trim();
    const sharedSecret = process.env.USOLVE_EMAIL_SHARED_SECRET?.trim();

    if (!appsScriptUrl || !sharedSecret) {
      return res.status(503).json({
        success: false,
        error: 'Service Unavailable',
        message: 'Confirmation email service is pending server configuration.'
      });
    }

    // 10. Forward Authenticated Request to Google Apps Script Web App
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12-second timeout

    let scriptResponse: Response;
    try {
      scriptResponse = await fetch(appsScriptUrl, {
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
        redirect: 'follow', // Follow 302 redirect from Google Apps Script to CDN
      });
    } finally {
      clearTimeout(timeoutId);
    }

    // Parse Apps Script JSON payload
    const scriptData: any = await scriptResponse.json().catch(() => null);

    // CRITICAL: Google Apps Script returns HTTP 200 even on logical errors because
    // ContentService.createTextOutput() cannot set HTTP status codes.
    // We MUST inspect scriptData.success === true.
    if (scriptResponse.ok && scriptData && scriptData.success === true) {
      return res.status(200).json({
        success: true,
        message: `Confirmation email dispatched to ${cleanEmail}.`,
        timestamp: scriptData.timestamp || new Date().toISOString(),
      });
    } else {
      const errorMessage = scriptData?.message || scriptData?.error || 'Failed to dispatch confirmation email.';
      // Return 502 Bad Gateway to the browser so the caller knows email failed
      return res.status(502).json({
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
