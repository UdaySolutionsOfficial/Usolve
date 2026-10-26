# USolve Corporate Website — Deployment & Launch Guide

This guide provides step-by-step instructions for deploying the **USolve** corporate website to production with proper contact-form delivery, custom domain mapping, and technical SEO readiness.

---

## 1. Hosting Architecture Overview

The USolve website is built as a high-performance Single Page Application (SPA) using React, Vite, and Tailwind CSS, accompanied by an optional serverless contact handler (`api/contact.ts`).

Recommended hosting platforms:
- **Vercel** (Recommended: native support for `vercel.json` SPA rewrites and `api/contact.ts` serverless functions).
- **Netlify** (Full support with `_redirects`).
- **Cloudflare Pages** (Supported with `_redirects`).

---

## 2. Setting Up Contact Form Delivery

Inquiries are delivered directly to: **`usolveofficial@gmail.com`**.

### Active Integration: Hosted Form Service (Formspree)
The website is pre-configured to use the official USolve Formspree form:
- **Endpoint**: `https://formspree.io/f/mjyyyojn`
- **Destination Inbox**: `usolveofficial@gmail.com`
- **Environment Variable**: `VITE_CONTACT_FORM_ENDPOINT=https://formspree.io/f/mjyyyojn`

> [!IMPORTANT]
> **Vite Environment Variables at Build Time**
> Vite bakes `VITE_*` environment variables directly into the compiled client-side JavaScript bundles during `npm run build`.
> When deploying on Vercel, Netlify, or any other hosting provider, configure `VITE_CONTACT_FORM_ENDPOINT` in the hosting dashboard **before** building, or trigger a **Redeploy** whenever the environment variable changes.

#### How It Works:
1. Submissions from `/contact` send an asynchronous POST request to `https://formspree.io/f/mjyyyojn` with `Accept: application/json`.
2. Form fields sent:
   - `name`: Client's full name
   - `email`: Client's email address
   - `service`: Selected project or service type
   - `message`: Detailed project requirements
   - `_gotcha`: Hidden honeypot field (silently suppresses automated spam bots)
3. If `VITE_CONTACT_FORM_ENDPOINT` is ever omitted, the form gracefully displays a clear configuration notification and offers the direct `mailto:` fallback without losing user input.

### Automated Client Confirmation Email (Google Apps Script — 100% Free)
When an enquiry is successfully received by Formspree, USolve can automatically dispatch an official, branded HTML confirmation email back to the prospective client using Google Apps Script's `MailApp.sendEmail` authorized under `usolveofficial@gmail.com`.

#### Architecture & Security:
1. **No Frontend Secrets**: Browser JavaScript never sees your shared secret or Apps Script URL.
2. **Vercel Serverless Relay**: The client calls `/api/send-confirmation` on Vercel.
3. **Secret Verification**: `/api/send-confirmation` verifies inputs and sends an authenticated POST request with `USOLVE_EMAIL_SHARED_SECRET` to `USOLVE_APPS_SCRIPT_URL`.
4. **Google MailApp Execution**: Google Apps Script verifies the secret against its own Script Properties, checks the remaining daily quota, and sends the branded confirmation email from `usolveofficial@gmail.com`.

#### Step-by-Step Setup Guide:
1. **Open Google Apps Script**:
   - Go to [script.google.com](https://script.google.com/) while signed in to **`usolveofficial@gmail.com`**.
   - Click **+ New project** and rename it to **`USolve Confirmation Email`**.
2. **Paste Code**:
   - Open [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) from this repository.
   - Replace all code in the script editor with the contents of `google-apps-script/Code.gs` and press **Ctrl+S** to save.
3. **Configure the Shared Secret**:
   - Click the gear icon (**Project Settings**) on the left toolbar.
   - Scroll to **Script Properties** and click **Edit script properties**.
   - Click **Add script property**:
     - **Property**: `SHARED_SECRET`
     - **Value**: (Generate a strong random password/key, e.g. using `openssl rand -hex 24` or any random password generator)
   - Click **Save script properties**.
4. **Deploy as a Web App**:
   - Click **Deploy** (blue button, top right) > **New deployment**.
   - Click the gear icon next to *Select type* and select **Web app**.
   - Configure:
     - **Description**: `USolve Confirmation Email Web App v1`
     - **Execute as**: `Me (usolveofficial@gmail.com)`
     - **Who has access**: `Anyone` *(Note: The script authenticates requests via the `SHARED_SECRET`)*
   - Click **Deploy**.
   - When prompted, click **Authorize access**, select `usolveofficial@gmail.com`, click **Advanced** > **Go to USolve Confirmation Email (unsafe)** (standard Google Apps Script prompt for custom scripts), and click **Allow**.
   - Copy the generated **Web App URL** (format: `https://script.google.com/macros/s/.../exec`).
5. **Configure Vercel Environment Variables**:
   - Go to your Vercel Project Dashboard > **Settings** > **Environment Variables**.
   - Add:
     - `USOLVE_APPS_SCRIPT_URL`: `<your-copied-web-app-url>`
     - `USOLVE_EMAIL_SHARED_SECRET`: `<the-exact-same-shared-secret-from-step-3>`
   - Click **Save**.

#### Free-Tier Quota & Boundaries:
- **Free Google Account (`@gmail.com`)**: 100 emails / day via `MailApp`.
- **Google Workspace Account**: 1,500 emails / day.
- **Cost**: **$0.00** forever. No subscriptions, credit cards, or paid third-party tiers required.
- **Quota Safeguard**: If the 100/day quota is ever reached, the script safely rejects further email attempts with HTTP 503 without crashing, while the contact form remains marked as successfully received by Formspree.

### Optional Future Alternative: Transactional Email via Vercel + Resend
If you ever migrate to custom transactional email routing using the included `api/contact.ts` serverless function:
1. Sign up at [Resend.com](https://resend.com/) and obtain an API Key (`re_...`).
2. Add your verified domain (e.g. `usolve.in`) in the Resend dashboard.
3. In your Vercel project settings under **Environment Variables**, add:
   - `RESEND_API_KEY`: your Resend API key (`re_...`)
   - `CONTACT_NOTIFICATION_EMAIL`: `usolveofficial@gmail.com`
   - `VERIFIED_SENDER_EMAIL`: `inquiries@usolve.in` (or `onboarding@resend.dev` for initial testing)
4. Update the client endpoint variable in Vercel:
   ```env
   VITE_CONTACT_FORM_ENDPOINT=/api/contact
   ```
5. Trigger a **Redeploy** on Vercel so Vite compiles the new endpoint.

---

## 3. Deploying to Vercel (Recommended)

1. Push your repository to GitHub, GitLab, or Bitbucket:
   ```bash
   git add .
   git commit -m "USolve Corporate Website — Phase 3 Complete"
   git remote add origin https://github.com/YourOrg/usolve-corporate-website.git
   git push -u origin main
   ```
2. Log into [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your Git repository.
4. Framework Preset will be automatically detected as **Vite**.
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Under **Environment Variables**, add:
   - `VITE_SITE_URL`: `https://your-custom-domain.com` (e.g. `https://usolve.in`)
   - `VITE_CONTACT_FORM_ENDPOINT`: `https://formspree.io/f/mjyyyojn`
   - `USOLVE_APPS_SCRIPT_URL`: your deployed Google Apps Script web app URL
   - `USOLVE_EMAIL_SHARED_SECRET`: your secret key matching Apps Script Script Properties
   - (If using Resend optionally): `RESEND_API_KEY`, `CONTACT_NOTIFICATION_EMAIL`
6. Click **Deploy**.
7. In Vercel Project Settings > **Domains**, add your custom domain (`usolve.in`) and configure DNS records as prompted (A record or CNAME).

---

## 4. Deploying to Netlify

1. Log into [Netlify](https://www.netlify.com/) and click **Add new site** > **Import an existing project**.
2. Connect your repository.
3. Build Settings:
   - Base directory: (leave empty)
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Netlify will automatically detect [`public/_redirects`](./public/_redirects) for SPA routing.
5. In Site configuration > **Environment variables**, configure `VITE_SITE_URL` and `VITE_CONTACT_FORM_ENDPOINT`.
6. Click **Deploy site**.

---

## 5. Post-Deployment Verification Checklist for Website Owner

Before publicly announcing the launch:

- [ ] **Custom Domain & HTTPS**: Ensure `https://your-domain.com` resolves with an active SSL certificate.
- [ ] **Test Contact Form**: Submit a real inquiry on `/contact` and confirm receipt at `usolveofficial@gmail.com`.
- [ ] **Direct URL Refresh**: Open `https://your-domain.com/work` and hit browser refresh to confirm SPA routing rewrite is working.
- [ ] **Google Search Console**:
  1. Add your property in [Google Search Console](https://search.google.com/search-console).
  2. Verify domain ownership (via DNS TXT record or HTML file).
  3. Submit your sitemap at: `https://your-domain.com/sitemap.xml`.
- [ ] **Social Media Cards**:
  - Test your URL in the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and [Twitter/X Card Validator](https://cards-dev.twitter.com/validator).
  - Verify that the USolve social card image (`og-share-usolve.png`) renders with the correct title and description.
- [ ] **Official Channels**: Confirm direct links to Instagram (`@usolve_official`) and GitHub (`@UdaySolutionsOfficial`) are active.
