import { COMPANY_INFO } from '../data/company';

export const getSiteUrl = (): string => {
  const envUrl = import.meta.env.VITE_SITE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/$/, '');
  }
  return 'https://usolve.in';
};

export interface PageSeoProps {
  title: string;
  description: string;
  path: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  structuredData?: Record<string, any>;
}

export const ROUTE_SEO: Record<string, PageSeoProps> = {
  home: {
    title: 'USolve — Code Meets Creativity | Software & Digital Solutions',
    description:
      'USolve is a modern software development and digital solutions company. We build websites, web applications, custom software, business automation, and practical AI systems.',
    path: '/',
    ogType: 'website',
  },
  services: {
    title: 'Services & Solutions — USolve',
    description:
      'Explore USolve digital services across Development, Digital Growth, and AI & Automation. Practical custom software, responsive websites, Meta Ads, and intelligent automation.',
    path: '/services',
    ogType: 'website',
  },
  work: {
    title: 'Our Work & Portfolio — USolve',
    description:
      'Verified portfolio of live websites, web applications, and digital systems built by USolve for commercial clients and educational institutions.',
    path: '/work',
    ogType: 'website',
  },
  about: {
    title: 'About Us — USolve',
    description:
      'Learn about USolve, our mission, core values, pragmatic development methodology, and our leadership: Founder & CEO Uday Kiran Tippani and Co-founder Jabeed Shaik.',
    path: '/about',
    ogType: 'website',
  },
  contact: {
    title: 'Contact Us — USolve',
    description:
      'Get in touch with USolve to discuss your website, software application, marketing campaign, or AI project. Direct consultations and structured project scoping.',
    path: '/contact',
    ogType: 'website',
  },
  faqs: {
    title: 'Frequently Asked Questions — USolve',
    description:
      'Find clear, straightforward answers about USolve services, custom software engineering, quotation requests, and ongoing website maintenance.',
    path: '/faqs',
    ogType: 'website',
  },
  privacyPolicy: {
    title: 'Privacy Policy — USolve',
    description:
      'USolve corporate privacy policy explaining our straightforward data handling principles, contact inquiry usage, and data security safeguards.',
    path: '/privacy-policy',
    ogType: 'website',
  },
};

/**
 * Standard Schema.org Organization Structured Data
 */
export const getOrganizationSchema = () => {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY_INFO.name,
    legalName: COMPANY_INFO.name,
    url: siteUrl,
    logo: `${siteUrl}/assets/brand/logo/logo-usolve-transparent.png`,
    description: COMPANY_INFO.shortIntro,
    email: COMPANY_INFO.email,
    telephone: COMPANY_INFO.phone,
    founder: [
      {
        '@type': 'Person',
        name: 'Uday Kiran Tippani',
        jobTitle: 'Founder & CEO',
      },
      {
        '@type': 'Person',
        name: 'Jabeed Shaik',
        jobTitle: 'Co-founder',
      },
    ],
    sameAs: [COMPANY_INFO.instagram, COMPANY_INFO.github],
  };
};

/**
 * Standard Schema.org WebSite Structured Data
 */
export const getWebSiteSchema = () => {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'USolve',
    url: siteUrl,
    description: 'Code Meets Creativity — Software development and digital solutions company',
  };
};
