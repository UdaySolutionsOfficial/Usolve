import {
  Globe,
  Code,
  Smartphone,
  Megaphone,
  Search,
  Bot,
  ShoppingBag,
  Palette,
  Layers,
  Cpu,
  Sparkles,
  Zap,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react';

export interface Service3DItem {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  badge: string;
  accentColor: string;
  bgGlow: string;
  icon: LucideIcon;
  tagline: string;
  highlights: string[];
  whatItDoes: string;
  whoItHelps: string;
  problemItSolves: string;
  features: string[];
  visualType:
    | 'web'
    | 'custom-software'
    | 'mobile'
    | 'marketing'
    | 'ai'
    | 'ecommerce'
    | 'branding'
    | 'seo';
  floatingPills: Array<{
    text: string;
    icon?: LucideIcon;
    className: string;
  }>;
}

export const SERVICES_3D_DATA: Service3DItem[] = [
  {
    id: 'web-design-dev',
    title: 'Website & Web App Development',
    shortTitle: 'Web & Web Apps',
    category: 'Digital Architecture',
    badge: 'Core Service',
    accentColor: '#245BCC',
    bgGlow: 'from-blue-600/20 via-sky-500/10 to-transparent',
    icon: Globe,
    tagline: 'Ultra-fast, responsive web platforms engineered with clean design and purposeful user flows.',
    highlights: ['React 18 & TypeScript', '100% Mobile Responsive', 'SEO-Ready Semantics', 'Sub-second Load Times'],
    whatItDoes:
      'We design and develop modern corporate websites, custom web apps, and client portals that present your company with authority and convert visitors into qualified inquiries.',
    whoItHelps:
      'Growing businesses, professional firms, clinics, educational institutions, and enterprises seeking a high-performance web presence.',
    problemItSolves:
      'Eliminates slow, bloated WordPress templates, disjointed user experiences, and outdated websites that fail to convert modern mobile visitors.',
    features: [
      'Tailored UI/UX design matching your genuine brand identity',
      'Hardware-accelerated animations with zero scroll lag',
      'Structured schema markup for search engine authority',
      'Clean modular TypeScript architecture ready to scale',
    ],
    visualType: 'web',
    floatingPills: [
      { text: 'React 18 & Vite', icon: Code, className: 'top-4 -left-4 sm:top-6 sm:-left-6' },
      { text: '100/100 Lighthouse', icon: Zap, className: 'bottom-8 -left-2 sm:bottom-10 sm:-left-6' },
      { text: 'Responsive Multi-Device', icon: Globe, className: 'top-6 -right-4 sm:top-8 sm:-right-8' },
      { text: 'SEO Architecture', icon: Search, className: 'bottom-6 -right-2 sm:bottom-8 sm:-right-6' },
    ],
  },
  {
    id: 'custom-software',
    title: 'Custom Software Solutions',
    shortTitle: 'Custom Software',
    category: 'Backend & Systems',
    badge: 'Architecture',
    accentColor: '#3B82F6',
    bgGlow: 'from-indigo-600/20 via-blue-500/10 to-transparent',
    icon: Code,
    tagline: 'Bespoke software systems built around your unique business logic instead of rigid templates.',
    highlights: ['Scalable Microservices', 'Secure Database Pipelines', 'Role-Based Dashboards', 'Zero Vendor Lock-In'],
    whatItDoes:
      'We engineer custom software systems and internal platforms tailored precisely to your operational workflow, replacing manual friction with automated reliability.',
    whoItHelps:
      'Companies outgrowing chaotic spreadsheets, disjointed SaaS tools, or outdated legacy systems that bottleneck operations.',
    problemItSolves:
      'Replaces repetitive manual data re-entry, communication silos, and software mismatches with a unified, dependable platform.',
    features: [
      'Custom database schema design (PostgreSQL / Relational / NoSQL)',
      'Secure authentication, role permissions, and audit logs',
      'High-throughput REST and GraphQL API integrations',
      'Real-time operational dashboards and telemetry reporting',
    ],
    visualType: 'custom-software',
    floatingPills: [
      { text: 'Modular APIs', icon: Layers, className: 'top-6 -left-4 sm:top-8 sm:-left-8' },
      { text: 'Data Integrity', icon: ShieldCheck, className: 'bottom-8 -left-2 sm:bottom-10 sm:-left-6' },
      { text: 'Scalable Cloud', icon: Cpu, className: 'top-4 -right-4 sm:top-6 sm:-right-8' },
      { text: 'Automated Logic', icon: Zap, className: 'bottom-6 -right-2 sm:bottom-8 sm:-right-6' },
    ],
  },
  {
    id: 'mobile-app-development',
    title: 'Android & iOS Mobile Apps',
    shortTitle: 'Mobile Apps',
    category: 'Mobile Systems',
    badge: 'iOS & Android',
    accentColor: '#10B981',
    bgGlow: 'from-emerald-600/20 via-teal-500/10 to-transparent',
    icon: Smartphone,
    tagline: 'High-performance cross-platform mobile apps and PWAs delivering seamless on-the-go utility.',
    highlights: ['Cross-Platform PWA', 'Instant Touch Responsiveness', 'Offline Caching', 'Native Device APIs'],
    whatItDoes:
      'We architect and build iOS and Android mobile applications that give your clients and operational teams instant, touch-optimized access to your services.',
    whoItHelps:
      'Businesses requiring direct customer touchpoints, fleet tracking, on-field operations, or interactive mobile workflows.',
    problemItSolves:
      'Bridges the gap between desktop systems and mobile users with reliable, offline-capable mobile experiences.',
    features: [
      'Single codebase efficiency across iOS and Android',
      'Push notification workflows and real-time alerts',
      'Progressive Web App (PWA) zero-install distribution option',
      'Secure local storage and background synchronization',
    ],
    visualType: 'mobile',
    floatingPills: [
      { text: 'iOS & Android', icon: Smartphone, className: 'top-6 -left-4 sm:top-8 sm:-left-8' },
      { text: '60 FPS Motion', icon: Zap, className: 'bottom-8 -left-2 sm:bottom-10 sm:-left-6' },
      { text: 'PWA Offline Ready', icon: Globe, className: 'top-4 -right-4 sm:top-6 sm:-right-8' },
      { text: 'Touch Optimized', icon: CheckCircle2, className: 'bottom-6 -right-2 sm:bottom-8 sm:-right-6' },
    ],
  },
  {
    id: 'meta-ads',
    title: 'Digital Marketing & Meta Ads',
    shortTitle: 'Meta Ads & Growth',
    category: 'Customer Acquisition',
    badge: 'Lead Gen',
    accentColor: '#8B5CF6',
    bgGlow: 'from-purple-600/20 via-pink-500/10 to-transparent',
    icon: Megaphone,
    tagline: 'Precision advertising campaigns on Facebook & Instagram engineered to drive genuine inquiries.',
    highlights: ['Hyper-Targeted Demographics', 'Conversion Tracking Funnels', 'Creative A/B Testing', 'ROI-Driven Strategy'],
    whatItDoes:
      'We plan, design, and manage performance advertising campaigns on Facebook and Instagram that connect your value proposition to active buyers.',
    whoItHelps:
      'Local businesses, e-commerce stores, education centers, and service companies looking to scale customer inquiries predictably.',
    problemItSolves:
      'Stops wasting advertising budgets on random boosting by focusing spend on audited audiences with clear conversion tracking.',
    features: [
      'Custom audience segmentation and lookalike modeling',
      'High-converting ad copy and high-resolution creative assets',
      'Meta Pixel and Conversions API server-side tracking',
      'Continuous campaign optimization and transparent lead reporting',
    ],
    visualType: 'marketing',
    floatingPills: [
      { text: 'High-Intent Leads', icon: TrendingUp, className: 'top-6 -left-4 sm:top-8 sm:-left-8' },
      { text: 'Targeted Demographics', icon: Megaphone, className: 'bottom-8 -left-2 sm:bottom-10 sm:-left-6' },
      { text: 'Conversion Funnels', icon: Zap, className: 'top-4 -right-4 sm:top-6 sm:-right-8' },
      { text: 'Verified ROI Tracking', icon: CheckCircle2, className: 'bottom-6 -right-2 sm:bottom-8 sm:-right-6' },
    ],
  },
  {
    id: 'ai-business-systems',
    title: 'AI-Powered Systems & Voice Agents',
    shortTitle: 'AI & Voice Agents',
    category: 'Autonomous Tech',
    badge: 'Next-Gen Automation',
    accentColor: '#06B6D4',
    bgGlow: 'from-cyan-600/20 via-blue-500/10 to-transparent',
    icon: Bot,
    tagline: 'Conversational voice bots and intelligent data pipelines to automate routine customer interactions.',
    highlights: ['Real-Time Voice AI', '24/7 Smart Answering', 'Workflow Automation', 'Sub-Second Latency'],
    whatItDoes:
      'We implement intelligent conversational systems and natural voice agents that handle customer inquiries, capture lead details, and automate repetitive workflows.',
    whoItHelps:
      'Service companies, clinics, real estate, and customer support desks receiving high call volumes or repetitive queries.',
    problemItSolves:
      'Eliminates missed calls, long customer wait times, and staff burnout from answering the same routine inquiries.',
    features: [
      'Natural-sounding voice synthesis with interruptible speech',
      'Custom knowledge base grounding on your business documents',
      'Direct CRM integration for immediate lead capture',
      'Automated appointment scheduling and status updates',
    ],
    visualType: 'ai',
    floatingPills: [
      { text: 'Voice Agents', icon: Bot, className: 'top-6 -left-4 sm:top-8 sm:-left-8' },
      { text: 'Zero Latency Stream', icon: Zap, className: 'bottom-8 -left-2 sm:bottom-10 sm:-left-6' },
      { text: '24/7 Availability', icon: ShieldCheck, className: 'top-4 -right-4 sm:top-6 sm:-right-8' },
      { text: 'LLM Orchestration', icon: Cpu, className: 'bottom-6 -right-2 sm:bottom-8 sm:-right-6' },
    ],
  },
  {
    id: 'ecommerce-solutions',
    title: 'E-commerce Website Development',
    shortTitle: 'E-commerce',
    category: 'Digital Retail',
    badge: 'Online Stores',
    accentColor: '#F59E0B',
    bgGlow: 'from-amber-600/20 via-orange-500/10 to-transparent',
    icon: ShoppingBag,
    tagline: 'Clean digital storefronts with structured catalogs, frictionless carts, and instant checkout flows.',
    highlights: ['Fast Product Browsing', 'Secure Payment Gateways', 'Inventory Sync', 'Mobile-First Shopping UX'],
    whatItDoes:
      'We design and build custom online stores with intuitive product exploration, secure payment checkouts, and seamless order notification flows.',
    whoItHelps:
      'Retail brands, direct-to-consumer manufacturers, wholesale merchants, and specialty boutiques expanding online.',
    problemItSolves:
      'Removes cart abandonment and shopping friction caused by clunky, slow, or confusing multi-step checkout processes.',
    features: [
      'Clean product category grids with instant search & filter',
      'Integration with Razorpay, Stripe, UPI, and major gateways',
      'Automated order confirmation and shipping status notifications',
      'Mobile-optimized touch cart drawer with instant quantity updates',
    ],
    visualType: 'ecommerce',
    floatingPills: [
      { text: 'Instant Checkout', icon: ShoppingBag, className: 'top-6 -left-4 sm:top-8 sm:-left-8' },
      { text: 'Secure Payments', icon: ShieldCheck, className: 'bottom-8 -left-2 sm:bottom-10 sm:-left-6' },
      { text: 'Live Inventory Sync', icon: Layers, className: 'top-4 -right-4 sm:top-6 sm:-right-8' },
      { text: 'Mobile Optimized', icon: Smartphone, className: 'bottom-6 -right-2 sm:bottom-8 sm:-right-6' },
    ],
  },
  {
    id: 'graphic-branding',
    title: 'Graphic Design & Digital Branding',
    shortTitle: 'Branding & Design',
    category: 'Visual Identity',
    badge: 'Brand Craft',
    accentColor: '#EC4899',
    bgGlow: 'from-pink-600/20 via-rose-500/10 to-transparent',
    icon: Palette,
    tagline: 'Cohesive visual identity systems, vector assets, and digital marketing design that builds trust.',
    highlights: ['Brand Design Tokens', 'Custom Vector Assets', 'High-Res Ad Creatives', 'Cross-Platform Consistency'],
    whatItDoes:
      'We craft unified brand identities, typography guidelines, vector illustrations, and digital marketing graphics that communicate credibility.',
    whoItHelps:
      'New startups and established companies seeking a polished, premium aesthetic across all digital channels.',
    problemItSolves:
      'Eliminates mismatched logos, pixelated graphics, and amateur visual presentation that diminishes business credibility.',
    features: [
      'Comprehensive brand style guides (colors, fonts, spacing tokens)',
      'Precision vector logo marks and social media kit assets',
      'High-conversion marketing banner creatives for Meta and Google',
      'Light and dark theme UI asset suites with crisp SVG vectors',
    ],
    visualType: 'branding',
    floatingPills: [
      { text: 'Vector Precision', icon: Palette, className: 'top-6 -left-4 sm:top-8 sm:-left-8' },
      { text: 'Design Systems', icon: Sparkles, className: 'bottom-8 -left-2 sm:bottom-10 sm:-left-6' },
      { text: 'Visual Consistency', icon: CheckCircle2, className: 'top-4 -right-4 sm:top-6 sm:-right-8' },
      { text: 'Brand Assets', icon: Layers, className: 'bottom-6 -right-2 sm:bottom-8 sm:-right-6' },
    ],
  },
  {
    id: 'seo-growth',
    title: 'Search Engine Optimization (SEO)',
    shortTitle: 'SEO & Growth',
    category: 'Search Visibility',
    badge: 'Rankings',
    accentColor: '#14B8A6',
    bgGlow: 'from-teal-600/20 via-cyan-500/10 to-transparent',
    icon: Search,
    tagline: 'Technical on-page SEO, clean schema markup, and speed optimization for organic search rankings.',
    highlights: ['Structured JSON-LD Schema', 'Core Web Vitals Optimization', 'Keyword Architecture', 'Google Indexation'],
    whatItDoes:
      'We audit and optimize your site architecture, technical meta tags, and structured schema data so Google accurately indexes and ranks your services.',
    whoItHelps:
      'Businesses looking to attract high-intent local searchers and organic website traffic without paying for every single click.',
    problemItSolves:
      'Fixes invisible websites that Google fails to index, missing rich snippets, and slow crawl speeds that keep competitors ahead.',
    features: [
      'Complete Schema.org structured data (Organization, LocalBusiness, FAQ)',
      'XML sitemap and robots.txt configuration for rapid crawling',
      'Lighthouse 95+ Core Web Vitals performance tuning',
      'Semantic HTML5 structure for high-intent search queries',
    ],
    visualType: 'seo',
    floatingPills: [
      { text: 'Technical SEO', icon: Search, className: 'top-6 -left-4 sm:top-8 sm:-left-8' },
      { text: 'Schema Markup', icon: Code, className: 'bottom-8 -left-2 sm:bottom-10 sm:-left-6' },
      { text: 'Core Web Vitals', icon: Zap, className: 'top-4 -right-4 sm:top-6 sm:-right-8' },
      { text: 'Organic Growth', icon: TrendingUp, className: 'bottom-6 -right-2 sm:bottom-8 sm:-right-6' },
    ],
  },
];
