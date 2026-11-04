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
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="services-showcase"
      aria-label="Digital Services Built for Business Utility"
      className="relative min-h-[280vh] bg-gradient-to-b from-brand-bg via-brand-bg-alt/30 to-brand-bg border-b border-brand-border/70"
    >
      {/* Sticky Viewport Container - Perfectly sized to fit any Windows screen, laptop, or mobile without clipping */}
      <div className="sticky top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] max-h-[100dvh] flex flex-col justify-between py-2 sm:py-3 px-4 overflow-hidden">
        {/* Section Heading - Sleek, compact & responsive with professional vertical separation */}
        <div className="max-w-4xl mx-auto px-4 text-center shrink-0 pt-1 sm:pt-2 mb-2 sm:mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-brand-blue/10 text-brand-blue border border-brand-blue/20 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
            <span>Our Core Capabilities</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
            Digital Services Built for Business Utility
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate max-w-xl mx-auto mt-1 sm:mt-1.5 line-clamp-1 sm:line-clamp-2">
            We build practical digital systems that streamline business operations, engage customers, and drive measurable growth.
          </p>
        </div>

        {/* 3D Concave Carousel Drum Wall - Endless 1-n-1 loop with generous breathing room */}
        <div className="w-full flex-1 flex flex-col items-center justify-center relative z-10 pt-4 sm:pt-6 md:pt-8 pb-1">
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

        {/* Bottom CTA Button */}
        <div className="text-center shrink-0 z-20 pb-1">
          <Button
            to="/services"
            variant="outline"
            size="sm"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            className="shadow-xs hover:shadow-md bg-white/95 backdrop-blur-md text-xs sm:text-sm py-1.5 px-4"
          >
            Explore All 13 Services & Detailed Capabilities
          </Button>
        </div>
      </div>
    </section>
  );
};
