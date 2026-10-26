import { ServiceItem } from '../types';

export const SERVICES_DATA: ServiceItem[] = [
  // Development
  {
    id: 'web-design-dev',
    title: 'Website Design & Development',
    category: 'development',
    shortDescription:
      'Fast, modern, responsive websites designed to present your business professionally and convert visitors into inquiries.',
    whatItDoes:
      'We design and build clean, responsive corporate websites, landing pages, and business portfolios tailored to your brand identity.',
    whoItHelps:
      'Small to medium businesses, professionals, clinics, schools, and companies looking to establish or modernize their web presence.',
    problemItSolves:
      'Replaces slow, outdated, or confusing websites with clean, fast-loading pages that look great on smartphones, tablets, and desktops.',
    iconName: 'Globe',
    features: ['Responsive Layouts', 'Clean Light-Theme UI', 'Fast Page Speeds', 'SEO-Ready Foundations'],
  },
  {
    id: 'web-applications',
    title: 'Web Application Development',
    category: 'development',
    shortDescription:
      'Interactive, browser-based applications with secure user flows, structured dashboards, and reliable database connections.',
    whatItDoes:
      'We develop web apps tailored to your operational workflows, from customer portals to inventory trackers and management tools.',
    whoItHelps:
      'Businesses needing tools that go beyond static pages to manage customer data, orders, schedules, or internal workflows.',
    problemItSolves:
      'Eliminates chaotic spreadsheets and disjointed tools by centralizing your business data into one organized, accessible interface.',
    iconName: 'Layers',
    features: ['Custom Portals & Dashboards', 'Database Integration', 'Role-Based Access', 'API Connectivity'],
  },
  {
    id: 'custom-software',
    title: 'Custom Software Solutions',
    category: 'development',
    shortDescription:
      'Tailored software architectures designed specifically to resolve your unique business bottlenecks and operational needs.',
    whatItDoes:
      'We architect and code software systems specifically configured to how your company functions, rather than forcing you into rigid off-the-shelf templates.',
    whoItHelps:
      'Growing companies with distinctive processes that standard software packages cannot properly accommodate.',
    problemItSolves:
      'Solves workflow friction, manual data re-entry, and process mismatches caused by generic software.',
    iconName: 'Code',
    features: ['Custom Business Logic', 'Modular Architecture', 'Scalable Codebases', 'Data Integrity & Security'],
  },
  {
    id: 'business-automation',
    title: 'Business Automation Systems',
    category: 'development',
    shortDescription:
      'Automated digital pipelines connecting your forms, databases, notifications, and repetitive administrative tasks.',
    whatItDoes:
      'We configure automated triggers and syncs between your business tools, customer communications, and operational records.',
    whoItHelps:
      'Teams spending excessive daily hours manually copying data, sending reminder emails, or coordinating routine updates.',
    problemItSolves:
      'Reduces human error, cuts down administrative labor hours, and ensures inquiries and operational tasks are handled instantly.',
    iconName: 'Cpu',
    features: ['Process Optimization', 'Trigger-Based Notifications', 'Data Syncing', 'Administrative Time Savings'],
  },
  {
    id: 'mobile-app-development',
    title: 'Android & iOS Mobile Apps',
    category: 'development',
    shortDescription:
      'Cross-platform mobile applications providing responsive, user-friendly experiences for customers and on-the-go teams.',
    whatItDoes:
      'We build mobile applications and Progressive Web Apps (PWAs) that run smoothly on modern iOS and Android devices.',
    whoItHelps:
      'Businesses whose customers or staff need direct, on-the-go access to booking, tracking, updates, or account management.',
    problemItSolves:
      'Allows businesses to stay connected with their mobile audience with intuitive touch interfaces and reliable performance.',
    iconName: 'Smartphone',
    features: ['Cross-Platform Apps', 'PWA Support', 'Offline & Fast Caching', 'Intuitive Mobile UI'],
  },
  {
    id: 'ecommerce-solutions',
    title: 'E-commerce Website Development',
    category: 'development',
    shortDescription:
      'Secure, easy-to-manage online stores with clear product displays, shopping cart flows, and direct checkout inquiries.',
    whatItDoes:
      'We design and build online stores with organized product catalogs, category filters, and smooth purchasing experiences.',
    whoItHelps:
      'Retailers, product brands, boutique stores, and entrepreneurs wanting to sell goods directly on the web.',
    problemItSolves:
      'Removes the friction from browsing and ordering products online, giving customers a reassuring shopping experience.',
    iconName: 'ShoppingBag',
    features: ['Product Catalogues', 'Cart & Checkout Flows', 'Order Notifications', 'Mobile Shopping UX'],
  },

  // Digital Growth
  {
    id: 'digital-marketing',
    title: 'Digital Marketing & Strategy',
    category: 'digital-growth',
    shortDescription:
      'Targeted digital strategies that connect your brand with qualified local and regional customers.',
    whatItDoes:
      'We design practical promotional campaigns to increase online visibility and drive relevant traffic to your business.',
    whoItHelps:
      'Local businesses and service providers seeking consistent customer inquiries and brand recognition.',
    problemItSolves:
      'Replaces guesswork and wasted ad spend with structured digital campaigns aimed at people genuinely interested in your services.',
    iconName: 'TrendingUp',
    features: ['Campaign Planning', 'Audience Research', 'Performance Tracking', 'Consistent Brand Reach'],
  },
  {
    id: 'meta-ads',
    title: 'Meta Ads Campaign Setup & Management',
    category: 'digital-growth',
    shortDescription:
      'Professional Facebook and Instagram advertising campaigns focused on local reach, lead generation, and store visits.',
    whatItDoes:
      'We configure, target, and monitor ad campaigns across Facebook and Instagram to reach customers in your service region.',
    whoItHelps:
      'Gyms, restaurants, educational institutes, retail stores, and service companies looking to generate leads.',
    problemItSolves:
      'Helps you avoid burning budgets on untargeted ad boosts by running properly structured campaigns with measurable returns.',
    iconName: 'Megaphone',
    features: ['Precise Demographic Targeting', 'Creative Ad Copy', 'Budget Optimization', 'Lead Capture Funnels'],
  },
  {
    id: 'seo-growth',
    title: 'Search Engine Optimization (SEO)',
    category: 'digital-growth',
    shortDescription:
      'Technical SEO, clean site structure, and localized metadata that help search engines understand and rank your business.',
    whatItDoes:
      'We optimize your website code, headings, loading speed, metadata, and content structure for Google and other search engines.',
    whoItHelps:
      'Businesses looking to be found organically when prospective customers search for their services in their city or industry.',
    problemItSolves:
      'Fixes invisible search ranking, slow indexing, and missing local search presence without black-hat gimmicks.',
    iconName: 'Search',
    features: ['On-Page Optimization', 'Semantic HTML Structure', 'Fast Core Web Vitals', 'Local Search Readiness'],
  },
  {
    id: 'graphic-branding',
    title: 'Graphic Design & Digital Branding',
    category: 'digital-growth',
    shortDescription:
      'Cohesive visual assets including logo refinements, social media banners, marketing materials, and digital graphics.',
    whatItDoes:
      'We create aligned visual brand assets that ensure your business looks polished across the web, social channels, and print.',
    whoItHelps:
      'Companies starting fresh or upgrading their visual presentation to reflect true professionalism.',
    problemItSolves:
      'Eliminates inconsistent logos, mismatched colors, and unrefined graphics that undermine customer trust.',
    iconName: 'Palette',
    features: ['Brand Identity Guidelines', 'Social Media Creatives', 'Marketing Assets', 'Vector Illustrations'],
  },

  // AI & Automation
  {
    id: 'ai-business-systems',
    title: 'AI-Powered Business Systems',
    category: 'ai-automation',
    shortDescription:
      'Practical artificial intelligence integrations that analyze inquiries, summarize documents, and assist daily operations.',
    whatItDoes:
      'We integrate vetted AI models into your software to process data, draft responses, and help staff make faster decisions.',
    whoItHelps:
      'Organizations handling heavy communication, document processing, or repetitive customer classification tasks.',
    problemItSolves:
      'Bridges the gap between AI hype and practical utility, implementing only solutions that genuinely save business time.',
    iconName: 'Bot',
    features: ['Document Classification', 'Data Extraction', 'Smart Query Handling', 'Private Data Governance'],
  },
  {
    id: 'ai-voice-agents',
    title: 'AI Voice Agents & Conversational Bots',
    category: 'ai-automation',
    shortDescription:
      'Automated conversational assistants that handle routine inquiries, appointment bookings, and customer FAQs 24/7.',
    whatItDoes:
      'We develop intelligent conversational interfaces and voice workflows that answer questions and capture customer details accurately.',
    whoItHelps:
      'Businesses receiving high volumes of repetitive inquiries outside standard business hours.',
    problemItSolves:
      'Ensures no potential customer is ignored when your team is busy or after office hours.',
    iconName: 'Headphones',
    features: ['24/7 Inquiry Handling', 'FAQ Knowledge Base', 'Booking Coordination', 'Clean Escalation to Humans'],
  },
  {
    id: 'maintenance-support',
    title: 'Maintenance, Support & Website Improvements',
    category: 'development',
    shortDescription:
      'Ongoing technical support, security patching, speed optimization, and regular feature updates for peace of mind.',
    whatItDoes:
      'We keep your web applications and sites secure, updated, and fast, handling technical issues as they arise.',
    whoItHelps:
      'Any business owner who wants a dependable developer on call without maintaining an expensive in-house IT team.',
    problemItSolves:
      'Prevents broken plugins, security vulnerabilities, downtime, and website degradation over time.',
    iconName: 'ShieldCheck',
    features: ['Regular Backups', 'Security Monitoring', 'Performance Tuning', 'Direct Developer Support'],
  },
];
