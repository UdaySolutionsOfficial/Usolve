import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { ConcaveCarousel, ConcaveCarouselItem } from '../common/ConcaveCarousel';

export const ServicesOverview: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const servicesData: ConcaveCarouselItem[] = [
    {
      id: 'web-design-dev',
      title: 'Website & Web App Development',
      shortTitle: 'Web Development',
      subtitle: 'High-performance responsive platforms & clean modern web engineering',
      badge: 'Web Systems',
      category: 'Web Platforms',
      image: '/assets/services/service-web-dev.jpg',
      link: '/services#web-design-dev',
      summary:
        'We design and build fast, beautifully crafted websites and web applications that captivate visitors and convert traffic into paying clients. From high-converting corporate sites to interactive portals, your brand gets a dependable digital home.',
      highlights: [
        'Lightning-fast load speeds optimized across all mobile and desktop screens',
        'Intuitive, conversion-focused design tailored specifically to your audience',
        'Modern, scalable web foundation built to expand smoothly as your business grows',
      ],
    },
    {
      id: 'custom-software',
      title: 'Custom Software Solutions',
      shortTitle: 'Custom Software',
      subtitle: 'Tailored architectures & modular API workflows for unique operations',
      badge: 'Architecture',
      category: 'Software Architecture',
      image: '/assets/services/service-custom-software.jpg',
      link: '/services#custom-software',
      summary:
        'Say goodbye to repetitive manual tasks and scattered spreadsheets. We build tailored software workflows, internal team portals, and automated business tools engineered precisely around how your company operates.',
      highlights: [
        'Automates complex daily routines to save valuable operational hours each week',
        'Connects seamlessly with your existing CRM, accounting, and cloud databases',
        'Secure, enterprise-grade reliability with zero recurring bloatware subscriptions',
      ],
    },
    {
      id: 'mobile-app-development',
      title: 'Mobile App Development',
      shortTitle: 'Mobile Apps',
      subtitle: 'Cross-platform iOS, Android, and PWA systems with native feel',
      badge: 'iOS & Android',
      category: 'Mobile Applications',
      image: '/assets/services/service-mobile-apps.jpg',
      link: '/services#mobile-app-development',
      summary:
        'Put your services directly into your customers’ hands. We build sleek, reliable mobile apps for iPhone and Android with responsive touch gestures, instant notifications, and smooth offline performance.',
      highlights: [
        'Fluid user experience across modern iOS and Android smartphones',
        'Effortless navigation and engagement loops designed to maximize customer retention',
        'Complete end-to-end guidance from app store approvals to post-launch updates',
      ],
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing & Meta Ads',
      shortTitle: 'Digital Marketing',
      subtitle: 'Targeted campaigns, conversion funnels & measurable customer reach',
      badge: 'Lead Gen',
      category: 'Digital Growth',
      image: '/assets/services/service-digital-marketing.jpg',
      link: '/services#meta-ads',
      summary:
        'Stop spending advertising budget on guesswork. We craft data-driven social media ad campaigns and conversion funnels that reach your ideal buyers and consistently produce qualified customer inquiries.',
      highlights: [
        'Precision audience targeting across Meta, Instagram, and search platforms',
        'High-converting ad creatives, persuasive copy, and dedicated landing pages',
        'Transparent weekly reporting with clear ROI and cost-per-lead tracking',
      ],
    },
    {
      id: 'seo-growth',
      title: 'SEO & Search Visibility',
      shortTitle: 'SEO & Growth',
      subtitle: 'Technical on-page SEO, Google ranking & Core Web Vitals optimization',
      badge: 'Organic Search',
      category: 'Search Optimization',
      image: '/assets/services/service-seo-growth.jpg',
      link: '/services#seo-growth',
      summary:
        'Get found by clients actively searching for your services online. We optimize technical speed, page structure, and Google ranking signals to deliver consistent, organic business leads month after month.',
      highlights: [
        'High Google rankings for valuable search queries that generate real inquiries',
        'Deep technical fixes that improve user retention and Google search trust',
        'Long-term compounding organic traffic without ongoing ad expenditure',
      ],
    },
    {
      id: 'ai-business-systems',
      title: 'AI Systems & Automation',
      shortTitle: 'AI Systems',
      subtitle: 'Conversational AI voice agents, smart pipelines & data intelligence',
      badge: 'AI & Automation',
      category: 'AI & Automation',
      image: '/assets/services/service-ai-systems.jpg',
      link: '/services#ai-business-systems',
      summary:
        'Empower your team with smart AI assistants and workflow automations that work 24/7. From conversational customer response agents to automated data pipelines, we make AI practical, simple, and profitable.',
      highlights: [
        '24/7 intelligent customer response and instant lead qualification',
        'Automated document extraction, routine processing, and smart notifications',
        'Custom-trained exclusively on your company’s real data, FAQs, and guidelines',
      ],
    },
    {
      id: 'ecommerce-solutions',
      title: 'E-commerce Solutions',
      shortTitle: 'E-Commerce',
      subtitle: 'Intuitive digital storefronts, product catalogs & streamlined checkout',
      badge: 'Online Stores',
      category: 'Digital Commerce',
      image: '/assets/services/service-ecommerce.jpg',
      link: '/services#ecommerce-solutions',
      summary:
        'Turn online visitors into loyal buyers with effortless digital shopping. We deliver fast product catalogs, 1-click mobile checkouts, and seamless payment processing engineered to maximize your online sales.',
      highlights: [
        'Frictionless checkout journey specifically optimized to prevent cart abandonment',
        'Seamless integration with secure global and domestic payment gateways',
        'Real-time inventory synchronization and automated order fulfillment alerts',
      ],
    },
    {
      id: 'graphic-branding',
      title: 'Graphic Design & Digital Branding',
      shortTitle: 'Brand Identity',
      subtitle: 'Cohesive brand identity, design systems & creative visual assets',
      badge: 'Brand Identity',
      category: 'Creative Design',
      image: '/assets/services/service-branding.jpg',
      link: '/services#graphic-branding',
      summary:
        'Make an unforgettable first impression that builds immediate trust. We develop memorable logos, complete brand guidelines, and premium marketing visuals that position your company as a market leader.',
      highlights: [
        'Complete brand identity systems: logos, color schemes, and brand style guides',
        'Polished marketing collateral for social media, pitch decks, and presentations',
        'Consistent, high-end visual language that earns client confidence and loyalty',
      ],
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="services-showcase"
      aria-label="Digital Services Built for Business Utility"
      className="relative min-h-[300vh] bg-gradient-to-b from-brand-bg via-brand-bg-alt/30 to-brand-bg border-b border-brand-border/70"
    >
      {/* Sticky Viewport Container - Generously sized with zero vertical clipping so the bottom button is always 100% visible */}
      <div className="sticky top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] max-h-[100dvh] flex flex-col justify-between py-1.5 sm:py-2.5 px-4 overflow-x-clip">
        {/* Section Heading - Sleek, compact & responsive */}
        <div className="max-w-4xl mx-auto px-4 text-center shrink-0 pt-0.5 sm:pt-1 mb-1 sm:mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-brand-blue/10 text-brand-blue border border-brand-blue/20 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
            <span>Our Core Capabilities</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
            Digital Services Built for Business Utility
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate max-w-xl mx-auto mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2">
            We build practical digital systems that streamline business operations, engage customers, and drive measurable growth.
          </p>
        </div>

        {/* 3D Concave Carousel Drum Wall - Endless 1-n-1 loop */}
        <div className="w-full flex-1 flex flex-col items-center justify-center relative z-10 pt-1 sm:pt-2 pb-0">
          <ConcaveCarousel
            items={servicesData}
            startIndex={0}
            curvature={0.72} // Inward curved drum
            distance={3.6} // Perspective depth
            tilt={0} // Straight-on view
            gap={24} // Pixel gap
            radius={20} // Panel corner radius
            reflection={0.14} // Studio floor reflection
            dim={0.35} // Edge dimming
            scrollTargetRef={sectionRef}
          />
        </div>

        {/* Bottom CTA Button - Guaranteed 100% visible and prominent */}
        <div className="text-center shrink-0 z-20 pt-1 pb-2 sm:pb-3">
          <Button
            to="/services"
            variant="outline"
            size="sm"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            className="shadow-sm hover:shadow-md bg-white/95 backdrop-blur-md text-xs sm:text-sm py-2 px-5 font-semibold text-brand-navy hover:text-brand-blue border border-brand-border hover:border-brand-blue/30"
          >
            Explore All 13 Services & Detailed Capabilities
          </Button>
        </div>
      </div>
    </section>
  );
};
