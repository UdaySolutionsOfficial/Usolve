import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { ConcaveCarousel, ConcaveCarouselItem } from '../common/ConcaveCarousel';

export const ServicesOverview: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const servicesData: ConcaveCarouselItem[] = [
    {
      id: 'web-design-dev',
      title: 'Website & Web App Development',
      subtitle: 'High-performance responsive platforms & clean modern web engineering',
      badge: 'Web Systems',
      category: 'Development',
      image: '/assets/services/service-web-dev.jpg',
      link: '/services#web-design-dev',
    },
    {
      id: 'custom-software',
      title: 'Custom Software Solutions',
      subtitle: 'Tailored architectures & modular API workflows for unique operations',
      badge: 'Architecture',
      category: 'Software Engineering',
      image: '/assets/services/service-custom-software.jpg',
      link: '/services#custom-software',
    },
    {
      id: 'mobile-app-development',
      title: 'Mobile App Development',
      subtitle: 'Cross-platform iOS, Android, and PWA systems with native feel',
      badge: 'iOS & Android',
      category: 'Mobile Applications',
      image: '/assets/services/service-mobile-apps.jpg',
      link: '/services#mobile-app-development',
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing & Meta Ads',
      subtitle: 'Targeted campaigns, conversion funnels & measurable customer reach',
      badge: 'Lead Gen',
      category: 'Digital Growth',
      image: '/assets/services/service-digital-marketing.jpg',
      link: '/services#meta-ads',
    },
    {
      id: 'seo-growth',
      title: 'SEO & Search Visibility',
      subtitle: 'Technical on-page SEO, Google ranking & Core Web Vitals optimization',
      badge: 'Organic Search',
      category: 'Search Optimization',
      image: '/assets/services/service-seo-growth.jpg',
      link: '/services#seo-growth',
    },
    {
      id: 'ai-business-systems',
      title: 'AI Systems & Automation',
      subtitle: 'Conversational AI voice agents, smart pipelines & data intelligence',
      badge: 'AI & Machine Learning',
      category: 'Automation',
      image: '/assets/services/service-ai-systems.jpg',
      link: '/services#ai-business-systems',
    },
    {
      id: 'ecommerce-solutions',
      title: 'E-commerce Solutions',
      subtitle: 'Intuitive digital storefronts, product catalogs & streamlined checkout',
      badge: 'Online Stores',
      category: 'Digital Commerce',
      image: '/assets/services/service-ecommerce.jpg',
      link: '/services#ecommerce-solutions',
    },
    {
      id: 'graphic-branding',
      title: 'Graphic Design & Digital Branding',
      subtitle: 'Cohesive brand identity, design systems & creative visual assets',
      badge: 'Brand Identity',
      category: 'Branding',
      image: '/assets/services/service-branding.jpg',
      link: '/services#graphic-branding',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="services-showcase"
      aria-label="Digital Services Built for Business Utility"
      className="relative min-h-[170vh] md:min-h-[210vh] bg-gradient-to-b from-brand-bg via-brand-bg-alt/30 to-brand-bg border-b border-brand-border/70 overflow-visible"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-12 sm:top-14 h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] flex flex-col justify-between py-6 sm:py-8 overflow-hidden">
        {/* Section Heading */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center shrink-0">
          <SectionHeading
            eyebrow="Our Core Capabilities"
            title="Digital Services Built for Business Utility"
            description="We focus on creating solutions that directly help businesses communicate with customers, streamline operations, and build confidence online."
            className="mb-0"
          />
        </div>

        {/* 3D Concave Carousel Drum Wall (Pixel-Perfect to React Bits Pro) */}
        <div className="w-full flex-1 flex items-center justify-center relative z-10 my-auto">
          <ConcaveCarousel
            items={servicesData}
            startIndex={2}
            curvature={0.72} // Inward curved drum
            distance={3.8} // Perspective depth
            tilt={0} // Straight-on view
            gap={16} // Pixel gap
            radius={20} // Panel corner radius
            reflection={0.12} // Floor reflection
            dim={0.35} // Edge dimming
            scrollDriven={true}
          />
        </div>

        {/* Bottom CTA Button */}
        <div className="text-center shrink-0 z-20 pb-2">
          <Button
            to="/services"
            variant="outline"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            className="shadow-xs hover:shadow-md bg-white/95 backdrop-blur-md"
          >
            Explore All 13 Services & Detailed Capabilities
          </Button>
        </div>
      </div>
    </section>
  );
};
