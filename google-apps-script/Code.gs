/**
 * USolve Corporate Website — Google Apps Script Confirmation Email Web App
 * 
 * Account: usolveofficial@gmail.com
 * Service: Google Apps Script MailApp
 * Free-Tier Quota: 100 emails/day for standard Gmail accounts, 1,500/day for Google Workspace
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open https://script.google.com/ and create a "New project".
 * 2. Rename the project to "USolve Confirmation Email".
 * 3. Replace all default code in Code.gs with this entire file.
 * 4. Open Project Settings (gear icon on left) -> "Script Properties".
 * 5. Add a property:
 *      Property: SHARED_SECRET
 *      Value:    <generate-a-strong-random-secret-e.g.-hex-or-uuid>
 * 6. Click "Deploy" -> "New deployment".
 * 7. Click the gear icon next to "Select type" and choose "Web app".
 * 8. Configure deployment settings:
 *      - Description: USolve Enquiry Confirmation Dispatcher
 *      - Execute as: Me (usolveofficial@gmail.com)
 *      - Who has access: Anyone
 * 9. Click "Deploy" and authorize access using your usolveofficial@gmail.com account.
 * 10. Copy the Web App URL (starts with https://script.google.com/macros/s/.../exec)
 *     and add it to your Vercel project environment variables as USOLVE_APPS_SCRIPT_URL.
 *     Add the same shared secret as USOLVE_EMAIL_SHARED_SECRET.
 */

// Global configuration
var CONFIG = {
  COMPANY_NAME: 'USolve',
  TAGLINE: 'Code Meets Creativity',
  SUPPORT_EMAIL: 'usolveofficial@gmail.com',
  PHONE: '+91 9492439986',
  PHONE_FORMATTED: '+91 94924 39986',
  WEBSITE_URL: 'https://usolve.in',
  LOGO_URL: 'https://usolve.in/assets/brand/logo/logo-usolve-transparent.png',
  INSTAGRAM_URL: 'https://www.instagram.com/usolve_official/',
  GITHUB_URL: 'https://github.com/UdaySolutionsOfficial',
  EMAIL_SUBJECT: "We've received your project enquiry | USolve",
  SENDER_NAME: 'USolve'
};

/**
 * Handles incoming POST requests from the Vercel serverless endpoint.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  var lockAcquired = false;

  try {
    lockAcquired = lock.tryLock(10000);
  } catch (lockErr) {
    lockAcquired = false;
  }

  // If lock cannot be obtained within timeout, reject safely rather than risking duplicate sends
  if (!lockAcquired) {
    return createJsonResponse({
      success: false,
      error: 'Server Busy',
      message: 'The email service is currently handling high volume. Please try again shortly.'
    });
  }

  try {
    // 1. Verify request body exists
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({
        success: false,
        error: 'Bad Request',
        message: 'Missing request payload.'
      });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return createJsonResponse({
        success: false,
        error: 'Invalid JSON',
        message: 'Could not parse JSON payload.'
      });
    }

    // 2. Authenticate using Shared Secret stored in Script Properties
    var scriptProperties = PropertiesService.getScriptProperties();
    var expectedSecret = scriptProperties.getProperty('SHARED_SECRET');

    if (!expectedSecret) {
      Logger.log('[CONFIGURATION ERROR] SHARED_SECRET is not configured in Script Properties.');
      return createJsonResponse({
        success: false,
        error: 'Configuration Error',
        message: 'Shared secret authentication is pending configuration.'
      });
    }

    var providedSecret = (data && data.secret) || (e.parameter && e.parameter.secret) || '';

    if (!providedSecret || providedSecret !== expectedSecret) {
      Logger.log('[AUTH FAILED] Unauthorized request rejected.');
      return createJsonResponse({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication failed. Invalid or missing secret token.'
      });
    }

    // 3. Honeypot check (defense in depth for automated bots)
    if (data._gotcha && String(data._gotcha).trim().length > 0) {
      Logger.log('[SPAM FILTER] Honeypot triggered. Silently completed.');
      return createJsonResponse({
        success: true,
        message: 'Enquiry processed.'
      });
    }

    // 4. Validate input fields
    var name = (data.name || '').toString().trim();
    var email = (data.email || '').toString().trim();
    var service = (data.service || 'Website Design & Development').toString().trim();
    var message = (data.message || '').toString().trim();

    if (!name || name.length < 2 || name.length > 100) {
      return createJsonResponse({
        success: false,
        error: 'Validation Error',
        message: 'Name must be between 2 and 100 characters.'
      });
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 150) {
      return createJsonResponse({
        success: false,
        error: 'Validation Error',
        message: 'A valid email address is required.'
      });
    }

    if (!message || message.length < 10 || message.length > 5000) {
      return createJsonResponse({
        success: false,
        error: 'Validation Error',
        message: 'Message must be between 10 and 5000 characters.'
      });
    }

    // 5. Check remaining MailApp quota
    var remainingQuota = MailApp.getRemainingDailyQuota();
    if (remainingQuota <= 0) {
      Logger.log('[QUOTA EXCEEDED] MailApp daily quota exhausted for today.');
      return createJsonResponse({
        success: false,
        error: 'Quota Exceeded',
        message: 'Daily email quota exhausted. Inquiry is securely recorded in Formspree.'
      });
    }

    // 6. Build Plain-Text and HTML Email bodies
    var plainTextBody = buildPlainTextConfirmation(name, email, service, message);
    var htmlBody = buildHtmlConfirmation(name, email, service, message);

    // 7. Dispatch Confirmation Email via MailApp
    MailApp.sendEmail({
      to: email,
      subject: CONFIG.EMAIL_SUBJECT,
      name: CONFIG.SENDER_NAME,
      body: plainTextBody,
      htmlBody: htmlBody,
      replyTo: CONFIG.SUPPORT_EMAIL
    });

    // Sanitized log without user message or sensitive tokens
    Logger.log('[SUCCESS] Confirmation email dispatched.');

    return createJsonResponse({
      success: true,
      message: 'Confirmation email successfully sent.',
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    Logger.log('[EXECUTION ERROR] Script error occurred.');
    return createJsonResponse({
      success: false,
      error: 'Internal Error',
      message: 'An unexpected error occurred while sending confirmation email.'
    });
  } finally {
    if (lockAcquired) {
      try {
        lock.releaseLock();
      } catch (releaseErr) {
        // Ignore lock release errors
      }
    }
  }
}

/**
 * Health check endpoint for monitoring.
 * Note: Does not disclose internal quota counts or sensitive details to anonymous callers.
 */
function doGet(e) {
  return createJsonResponse({
    service: 'USolve Confirmation Email Web App',
    status: 'online'
  });
}

/**
 * Escapes user-supplied content to prevent HTML injection / XSS.
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Constructs plain-text alternative body.
 */
function buildPlainTextConfirmation(name, email, service, message) {
  return [
    'Hello ' + name + ',',
    '',
    'Thank you for reaching out to USolve! We have received your project enquiry.',
    '',
    '--- ENQUIRY DETAILS ---',
    'Service Requested: ' + service,
    'Contact Email:     ' + email,
    '',
    'Project Overview:',
    message,
    '',
    '--- WHAT HAPPENS NEXT ---',
    '1. Technical Review: Our engineering team reviews your requirements and scope.',
    '2. Direct Follow-Up: We will contact you via email or phone to discuss practical technical solutions and next steps.',
    '',
    '--- NEED IMMEDIATE ASSISTANCE? ---',
    'Email: ' + CONFIG.SUPPORT_EMAIL,
    'Phone: ' + CONFIG.PHONE,
    'Web:   ' + CONFIG.WEBSITE_URL,
    '',
    'Best regards,',
    'USolve Engineering Team',
    CONFIG.TAGLINE,
    CONFIG.WEBSITE_URL
  ].join('\n');
}

/**
 * Constructs responsive, email-client-compatible HTML email body.
 * Embeds authentic USolve brand logo with accessible fallback text.
 */
function buildHtmlConfirmation(name, email, service, message) {
  var safeName = escapeHtml(name);
  var safeEmail = escapeHtml(email);
  var safeService = escapeHtml(service);
  var safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  return '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
    '<meta charset="UTF-8"/>' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>' +
    '<title>We have received your project enquiry</title>' +
    '</head>' +
    '<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #142744; -webkit-font-smoothing: antialiased;">' +
    '  <!-- Wrapper Table -->' +
    '  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; padding: 24px 12px;">' +
    '    <tr>' +
    '      <td align="center">' +
    '        <!-- Main Container Card -->' +
    '        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #DFE6EF; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">' +
    '          ' +
    '          <!-- Brand Header with Logo -->' +
    '          <tr>' +
    '            <td style="padding: 28px 32px; background: linear-gradient(135deg, #142744 0%, #1E50C8 100%); color: #FFFFFF; text-align: left;">' +
    '              <table role="presentation" cellpadding="0" cellspacing="0" border="0">' +
    '                <tr>' +
    '                  <td valign="middle" style="padding-right: 14px;">' +
    '                    <img src="' + CONFIG.LOGO_URL + '" alt="USolve" width="44" height="44" style="display: block; width: 44px; height: 44px; border: 0; outline: none;" />' +
    '                  </td>' +
    '                  <td valign="middle">' +
    '                    <div style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #FFFFFF; margin: 0; line-height: 1.1;">' +
    '                      USolve' +
    '                    </div>' +
    '                    <div style="font-size: 13px; color: #E0E7FF; margin-top: 3px; font-weight: 500; letter-spacing: 0.3px;">' +
    '                      ' + CONFIG.TAGLINE + '' +
    '                    </div>' +
    '                  </td>' +
    '                </tr>' +
    '              </table>' +
    '            </td>' +
    '          </tr>' +
    '          ' +
    '          <!-- Confirmation Heading & Message -->' +
    '          <tr>' +
    '            <td style="padding: 32px 32px 16px 32px;">' +
    '              <h1 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #142744; line-height: 1.3;">' +
    '                We\'ve Received Your Project Enquiry' +
    '              </h1>' +
    '              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #526176;">' +
    '                Hi <strong style="color: #142744;">' + safeName + '</strong>,' +
    '              </p>' +
    '              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #526176;">' +
    '                Thank you for reaching out to <strong>USolve</strong>. We have successfully received your enquiry regarding <strong>' + safeService + '</strong>. Our team is reviewing the project details you submitted.' +
    '              </p>' +
    '            </td>' +
    '          </tr>' +
    '          ' +
    '          <!-- Summary Box -->' +
    '          <tr>' +
    '            <td style="padding: 0 32px 24px 32px;">' +
    '              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; border: 1px solid #DFE6EF; border-radius: 8px; padding: 18px;">' +
    '                <tr>' +
    '                  <td style="padding-bottom: 10px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #1E50C8;">' +
    '                    Enquiry Summary' +
    '                  </td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="font-size: 13px; line-height: 1.8; color: #526176;">' +
    '                    <strong style="color: #142744;">Service:</strong> ' + safeService + '<br/>' +
    '                    <strong style="color: #142744;">Email:</strong> <a href="mailto:' + safeEmail + '" style="color: #1E50C8; text-decoration: none;">' + safeEmail + '</a>' +
    '                  </td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="padding-top: 12px; border-top: 1px solid #E2E8F0; margin-top: 12px; font-size: 13px; line-height: 1.6; color: #142744;">' +
    '                    <strong style="color: #526176; font-size: 12px; text-transform: uppercase;">Your Message:</strong>' +
    '                    <div style="margin-top: 6px; padding: 10px 12px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E2E8F0; font-style: normal; color: #334155; font-size: 13px;">' +
    '                      ' + safeMessage + '' +
    '                    </div>' +
    '                  </td>' +
    '                </tr>' +
    '              </table>' +
    '            </td>' +
    '          </tr>' +
    '          ' +
    '          <!-- What Happens Next -->' +
    '          <tr>' +
    '            <td style="padding: 0 32px 28px 32px;">' +
    '              <div style="font-size: 14px; font-weight: 700; color: #142744; margin-bottom: 12px;">' +
    '                What happens next?' +
    '              </div>' +
    '              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; color: #526176; line-height: 1.6;">' +
    '                <tr>' +
    '                  <td valign="top" style="width: 28px; padding-bottom: 10px;">' +
    '                    <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #EBF1FC; color: #1E50C8; font-weight: bold; font-size: 12px; text-align: center; line-height: 20px;">1</div>' +
    '                  </td>' +
    '                  <td style="padding-bottom: 10px;">' +
    '                    <strong style="color: #142744;">Technical Review:</strong> We analyze your requirements and architectural needs.' +
    '                  </td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td valign="top" style="width: 28px;">' +
    '                    <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #EBF1FC; color: #1E50C8; font-weight: bold; font-size: 12px; text-align: center; line-height: 20px;">2</div>' +
    '                  </td>' +
    '                  <td>' +
    '                    <strong style="color: #142744;">Direct Follow-up:</strong> An engineering lead will reach out to discuss solutions, timeline, and next steps.' +
    '                  </td>' +
    '                </tr>' +
    '              </table>' +
    '            </td>' +
    '          </tr>' +
    '          ' +
    '          <!-- Direct Contact Card -->' +
    '          <tr>' +
    '            <td style="padding: 0 32px 32px 32px;">' +
    '              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F1F5F9; border-radius: 8px; padding: 16px;">' +
    '                <tr>' +
    '                  <td style="font-size: 13px; color: #526176; line-height: 1.6;">' +
    '                    Need to update your requirements or speak with us immediately?<br/>' +
    '                    Email: <a href="mailto:' + CONFIG.SUPPORT_EMAIL + '" style="color: #1E50C8; font-weight: 600; text-decoration: none;">' + CONFIG.SUPPORT_EMAIL + '</a><br/>' +
    '                    Phone / WhatsApp: <a href="tel:' + CONFIG.PHONE + '" style="color: #1E50C8; font-weight: 600; text-decoration: none;">' + CONFIG.PHONE_FORMATTED + '</a>' +
    '                  </td>' +
    '                </tr>' +
    '              </table>' +
    '            </td>' +
    '          </tr>' +
    '          ' +
    '          <!-- Footer -->' +
    '          <tr>' +
    '            <td style="padding: 24px 32px; background-color: #F8FAFC; border-top: 1px solid #DFE6EF; text-align: center; font-size: 12px; color: #64748B; line-height: 1.6;">' +
    '              <div style="font-weight: 600; color: #142744; margin-bottom: 4px;">' +
    '                USolve — Software & Digital Solutions' +
    '              </div>' +
    '              <div style="margin-bottom: 8px;">' +
    '                <a href="' + CONFIG.WEBSITE_URL + '" style="color: #1E50C8; text-decoration: none; margin: 0 6px;">Website</a> &bull;' +
    '                <a href="' + CONFIG.INSTAGRAM_URL + '" style="color: #1E50C8; text-decoration: none; margin: 0 6px;">Instagram</a> &bull;' +
    '                <a href="' + CONFIG.GITHUB_URL + '" style="color: #1E50C8; text-decoration: none; margin: 0 6px;">GitHub</a>' +
    '              </div>' +
    '              <div style="color: #94A3B8; font-size: 11px;">' +
    '                This is an automated confirmation of your enquiry received via usolve.in. If you did not make this request, please disregard this email.' +
    '              </div>' +
    '            </td>' +
    '          </tr>' +
    '          ' +
    '        </table>' +
    '      </td>' +
    '    </tr>' +
    '  </table>' +
    '</body>' +
    '</html>';
}

/**
 * Creates standard JSON response for Google Apps Script Web App.
 * 
 * NOTE ON HTTP STATUS CODES:
 * Google Apps Script's ContentService.createTextOutput() does not support setting
 * custom HTTP status codes (it always returns HTTP 200 at the transport layer).
 * The caller must parse the JSON payload and inspect the "success" boolean field.
 */
function createJsonResponse(payload) {
  var output = ContentService.createTextOutput(JSON.stringify(payload));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
