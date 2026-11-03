import React, { useRef } from 'react';
import { ArrowRight, Globe, Code, Smartphone, Megaphone, Search, Bot, ShoppingBag, Palette } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { ConcaveCarousel, ConcaveCarouselItem } from '../common/ConcaveCarousel';

export const ServicesOverview: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const servicesData: ConcaveCarouselItem[] = [
    {
      id: 'web-design-dev',
      title: 'Website & Web App Development',
      description:
        'Fast, responsive websites and interactive web platforms designed around clean interfaces and practical user flows.',
      badge: 'Core Service',
      category: 'Web & Systems',
      image: '/assets/services/service-web-dev.jpg',
      link: '/services#web-design-dev',
      features: ['Responsive UI', 'Clean Code', 'Fast Loading', 'SEO Foundations'],
      icon: Globe,
    },
    {
      id: 'custom-software',
      title: 'Custom Software Solutions',
      description:
        'Tailored software architectures engineered to match your operational workflows rather than generic template software.',
      badge: 'Architecture',
      category: 'B2B Software',
      image: '/assets/services/service-custom-software.jpg',
      link: '/services#custom-software',
      features: ['Custom Logic', 'Modular API', 'Scalable Cloud', 'Data Security'],
      icon: Code,
    },
    {
      id: 'mobile-app-development',
      title: 'Mobile App Development',
      description:
        'Cross-platform applications and PWAs for Android and iOS providing dependable mobile access for clients and operations.',
      badge: 'iOS & Android',
      category: 'Mobile Tech',
      image: '/assets/services/service-mobile-apps.jpg',
      link: '/services#mobile-app-development',
      features: ['Cross-Platform', 'PWA Support', 'Offline Caching', 'Native Feel'],
      icon: Smartphone,
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing & Meta Ads',
      description:
        'Targeted advertising campaigns on Facebook and Instagram structured to generate genuine local leads and customer inquiries.',
      badge: 'Lead Gen',
      category: 'Growth Strategy',
      image: '/assets/services/service-digital-marketing.jpg',
      link: '/services#meta-ads',
      features: ['Meta Ads', 'Funnel Design', 'Audience Reach', 'Measurable ROI'],
      icon: Megaphone,
    },
    {
      id: 'seo-growth',
      title: 'SEO & Online Growth',
      description:
        'Technical on-page SEO, clean schema markup, and speed optimizations that help search engines index and rank your pages.',
      badge: 'Search Visibility',
      category: 'Organic Growth',
      image: '/assets/services/service-seo-growth.jpg',
      link: '/services#seo-growth',
      features: ['Technical SEO', 'Schema Markup', 'Core Web Vitals', 'Local Ranking'],
      icon: Search,
    },
    {
      id: 'ai-business-systems',
      title: 'AI-Powered Systems & Automation',
      description:
        'Practical conversational interfaces, automated voice systems, and data processing tools to streamline repetitive work.',
      badge: 'AI & Automation',
      category: 'Intelligence',
      image: '/assets/services/service-ai-systems.jpg',
      link: '/services#ai-business-systems',
      features: ['AI Systems', 'Voice Agents', 'Smart Workflow', 'Private Data'],
      icon: Bot,
    },
    {
      id: 'ecommerce-solutions',
      title: 'E-commerce Solutions',
      description:
        'Clean digital storefronts with structured product catalogs, shopping carts, and intuitive inquiry and checkout flows.',
      badge: 'Online Stores',
      category: 'Digital Retail',
      image: '/assets/services/service-ecommerce.jpg',
      link: '/services#ecommerce-solutions',
      features: ['Catalog Design', 'Cart Flows', 'Order Notifications', 'Mobile UX'],
      icon: ShoppingBag,
    },
    {
      id: 'graphic-branding',
      title: 'Graphic Design & Digital Branding',
      description:
        'Cohesive digital brand assets, marketing creatives, and visual identity systems that build credibility across platforms.',
      badge: 'Brand Identity',
      category: 'Design Systems',
      image: '/assets/services/service-branding.jpg',
      link: '/services#graphic-branding',
      features: ['Brand Guidelines', 'Social Creatives', 'Vector Assets', 'Visual System'],
      icon: Palette,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="services-showcase"
      aria-label="Digital Services Built for Business Utility"
      className="relative min-h-[175vh] md:min-h-[220vh] bg-gradient-to-b from-brand-bg-alt/40 via-brand-bg to-brand-bg-alt/70 border-b border-brand-border/70"
    >
      {/* Sticky Full-Viewport Presentation Container */}
      <div className="sticky top-12 sm:top-14 h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] flex flex-col justify-between py-6 sm:py-8 overflow-hidden">
        {/* Section Heading Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center shrink-0">
          <SectionHeading
            eyebrow="Our Core Capabilities"
            title="Digital Services Built for Business Utility"
            description="A curved 3D interactive showcase of solutions engineered to help businesses communicate with customers, streamline operations, and scale with confidence."
            className="mb-0"
          />
        </div>

        {/* 3D Concave Carousel Gallery Wall */}
        <div className="w-full flex-1 flex items-center justify-center relative z-10">
          <ConcaveCarousel
            items={servicesData}
            curvature={0.72} // Curves inward like an IMAX drum
            distance={4} // Optimal perspective depth
            tilt={2} // Slight top-down viewer tilt
            gap={20}
            radius={20}
            reflection={0.08} // Faint floor reflection
            dim={0.35} // Edge dimming
            autoplay="off" // Driven directly by page scroll & gestures
            scrollDriven={true}
          />
        </div>

        {/* Bottom CTA & Capabilities Link */}
        <div className="text-center shrink-0 z-20 pb-2">
          <Button
            to="/services"
            variant="outline"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            className="shadow-xs hover:shadow-md bg-white/90 backdrop-blur-md"
          >
            Explore All 13 Services & Detailed Capabilities
          </Button>
        </div>
      </div>
    </section>
  );
};
