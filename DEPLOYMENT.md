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

Inquiries should reach: **`usolveofficial@gmail.com`**.

Choose one of two straightforward options:

### Option A: Hosted Form Service (Easiest — Formspree)
1. Sign up for free at [Formspree.io](https://formspree.io/).
2. Create a new form titled **USolve Inquiries** and set target email to `usolveofficial@gmail.com`.
3. Copy your Form ID (e.g., `https://formspree.io/f/mqkvojzb`).
4. In your hosting platform's environment variables (or `.env.local`), set:
   ```env
   VITE_CONTACT_FORM_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
   ```
5. Trigger a deployment. Submissions from `/contact` will instantly be routed to `usolveofficial@gmail.com` with Formspree's built-in spam protections.

### Option B: Transactional Email via Vercel + Resend
If deploying on Vercel with the included `api/contact.ts` serverless function:
1. Sign up at [Resend.com](https://resend.com/) and obtain an API Key (`re_...`).
2. Add your verified domain (e.g. `usolve.in`) in the Resend dashboard.
3. In the Vercel project settings under **Environment Variables**, add:
   - `RESEND_API_KEY`: your Resend API key (`re_...`)
   - `CONTACT_NOTIFICATION_EMAIL`: `usolveofficial@gmail.com`
   - `VERIFIED_SENDER_EMAIL`: `inquiries@usolve.in` (or `onboarding@resend.dev` for initial testing)
4. Set the client endpoint:
   ```env
   VITE_CONTACT_FORM_ENDPOINT=/api/contact
   ```
5. Incoming inquiries will be sent directly from your serverless function to `usolveofficial@gmail.com` with clean HTML formatting and direct reply-to headers.

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
   - `VITE_CONTACT_FORM_ENDPOINT`: your endpoint choice from Step 2
   - (If using Resend): `RESEND_API_KEY`, `CONTACT_NOTIFICATION_EMAIL`
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
