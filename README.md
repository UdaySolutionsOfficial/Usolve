# USolve Corporate Website

> **Code Meets Creativity** — Official corporate website for USolve, a modern software development and digital solutions company.

This repository contains the production-ready corporate website for **USolve**, engineered to communicate trust, technical capability, simplicity, and craftsmanship.

---

## Technical Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6 (fast HMR and optimized tree-shaken production bundles)
- **Styling**: Tailwind CSS 3 with custom brand design tokens
- **Typography**: Google Fonts — Manrope (Headings) & Inter (Body UI)
- **Motion & Interactions**: Framer Motion & CSS hardware-accelerated transforms (respects `prefers-reduced-motion`)
- **Icons**: Lucide React
- **Routing**: React Router DOM 6 with route-level code splitting (`React.lazy`)
- **Backend / Delivery Layer**: Formspree contact delivery to `usolveofficial@gmail.com` with honeypot spam protection, plus optional serverless email handler (`api/contact.ts`) supporting Resend

---

## Seven Core Pages

1. **Home (`/`)**: Split hero layout with SVG system telemetry visual, core services, delivered projects, grounded benefits, 4-step execution lifecycle, and executive leadership snapshot.
2. **Services (`/services`)**: Comprehensive breakdown of 13 digital services grouped into **Development**, **Digital Growth**, and **AI & Automation** with practical explanations (what it does, who it helps, problem it solves).
3. **Our Work (`/work`)**: Verified portfolio showcasing all 7 live client projects with authentic high-resolution previews, deliverables, tech tags, and a **Project Quick-View Modal**.
4. **About Us (`/about`)**: Company introduction, mission, vision, 4 core values, and profiles for Founder & CEO Uday Kiran Tippani and Co-founder Jabeed Shaik.
5. **Contact Us (`/contact`)**: Direct contact channels (Email, Phone/WhatsApp, Instagram, GitHub) and a validated inquiry form with honeypot spam protection.
6. **FAQs (`/faqs`)**: Keyboard-accessible ARIA accordion answering 8 fundamental questions without invented pricing or commitments.
7. **Privacy Policy (`/privacy-policy`)**: Transparent 7-section data governance statement matching actual implementation.

---

## 7 Verified Client Projects

1. **[DiyasNduas](https://diyasnduas.com/)** — E-Commerce & Retail product catalogue with responsive shopping UI.
2. **[Surya School Bus Tracking](https://surya-school-bus-tracking.web.app/)** — Real-time PWA school bus transit and route monitoring system.
3. **[S.N. Olympia Fitness Gym](https://snolympiafitnessgym.vercel.app/)** — Modern fitness club showcase with membership channels.
4. **[DS Fitness Zone](https://ds-fitness-zone.vercel.app/)** — Strength & conditioning gym portal with direct contact points.
5. **[Priyanka Jewellery](https://priyanka-jewellery.vercel.app/)** — Fine jewellery product catalog and digital showroom.
6. **[RIO Unlimited Restaurant](https://rio-unlimited-restaurant-website.vercel.app/)** — Dining web presence with digital menus and table inquiry points.
7. **[Uday Solutions Portfolio](https://uday-solutions.onrender.com/)** — Creative technology evolution showcase and studio predecessor.

---

## Local Development & Commands

### Prerequisites
- Node.js `v18.0.0` or higher (tested on Node `v24.x`)
- npm `v9.x` or higher

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Run TypeScript Checks
```bash
npm run lint
```

### Production Build
```bash
npm run build
```
Generates optimized, code-split assets into the `dist/` directory.

### Preview Production Build Locally
```bash
npm run preview
```

---

## Environment Configuration

Copy `.env.example` to `.env.local` to configure local or deployment settings:

```bash
cp .env.example .env.local
```

| Variable | Scope | Description | Default |
|---|---|---|---|
| `VITE_SITE_URL` | Client | Canonical production URL for SEO, sitemap, and social cards | `https://usolve.in` |
| `VITE_CONTACT_FORM_ENDPOINT` | Client | Form endpoint URL (Active Formspree endpoint: `https://formspree.io/f/mjyyyojn`) | Unset / requires config |
| `RESEND_API_KEY` | Server-only | Secret API key from Resend for optional serverless email delivery | Optional (Serverless only) |
| `CONTACT_NOTIFICATION_EMAIL` | Server-only | Recipient inbox for incoming client inquiries | `usolveofficial@gmail.com` |

> **Note on Client Environment Variables**: Vite compiles `VITE_*` variables into static bundles during build time. Always trigger a new build/deployment after modifying `VITE_CONTACT_FORM_ENDPOINT` on hosting providers.

---

## Deployment & Launch

Detailed deployment instructions for Vercel, Netlify, and Cloudflare Pages are provided in [`DEPLOYMENT.md`](./DEPLOYMENT.md).
