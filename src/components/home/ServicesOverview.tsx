import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Code,
  Smartphone,
  Megaphone,
  Search,
  Bot,
  ShoppingBag,
  Palette,
  ArrowRight,
} from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const ServicesOverview: React.FC = () => {
  const featuredServices = [
    {
      title: 'Website & Web App Development',
      description:
        'Fast, responsive, modern websites and interactive web platforms designed around clean interfaces and practical user flows.',
      icon: Globe,
      link: '/services#web-design-dev',
      badge: 'Core Service',
    },
    {
      title: 'Custom Software Solutions',
      description:
        'Tailored software architectures engineered to match your operational workflows rather than generic template software.',
      icon: Code,
      link: '/services#custom-software',
      badge: 'Architecture',
    },
    {
      title: 'Mobile App Development',
      description:
        'Cross-platform applications and PWAs for Android and iOS providing dependable mobile access for clients and operations.',
      icon: Smartphone,
      link: '/services#mobile-app-development',
      badge: 'iOS & Android',
    },
    {
      title: 'Digital Marketing & Meta Ads',
      description:
        'Targeted advertising campaigns on Facebook and Instagram structured to generate genuine local leads and customer inquiries.',
      icon: Megaphone,
      link: '/services#meta-ads',
      badge: 'Lead Gen',
    },
    {
      title: 'SEO & Online Growth',
      description:
        'Technical on-page SEO, clean schema markup, and speed optimizations that help search engines index and rank your pages.',
      icon: Search,
      link: '/services#seo-growth',
      badge: 'Search Visibility',
    },
    {
      title: 'AI-Powered Systems & Voice Agents',
      description:
        'Practical conversational interfaces, automated voice systems, and data processing tools to streamline repetitive work.',
      icon: Bot,
      link: '/services#ai-business-systems',
      badge: 'Automation',
    },
    {
      title: 'E-commerce Solutions',
      description:
        'Clean digital storefronts with structured product catalogs, shopping carts, and intuitive inquiry and checkout flows.',
      icon: ShoppingBag,
      link: '/services#ecommerce-solutions',
      badge: 'Online Stores',
    },
    {
      title: 'Graphic Design & Branding',
      description:
        'Cohesive digital brand assets, marketing creatives, and visual identity systems that build credibility across platforms.',
      icon: Palette,
      link: '/services#graphic-branding',
      badge: 'Brand Identity',
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-brand-bg-alt/60 border-b border-brand-border/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Core Capabilities"
          title="Digital Services Built for Business Utility"
          description="We focus on creating solutions that directly help businesses communicate with customers, streamline operations, and build confidence online."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Card
                key={idx}
                variant="interactive"
                padding="md"
                className="flex flex-col justify-between group h-full border border-brand-border hover:border-brand-blue/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors duration-200 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-brand-slate uppercase tracking-wider bg-brand-bg-alt px-2.5 py-1 rounded-md border border-brand-border/70">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-navy mb-2.5 group-hover:text-brand-blue transition-colors duration-150">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-slate leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <Link
                  to={service.link}
                  className="inline-flex items-center text-xs font-semibold text-brand-blue hover:text-brand-blue-hover gap-1.5 pt-3 border-t border-brand-border/60 mt-auto"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Card>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <Button
            to="/services"
            variant="outline"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Explore All 13 Services & Detailed Capabilities
          </Button>
        </div>
      </div>
    </section>
  );
};
