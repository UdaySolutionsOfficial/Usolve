import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/services';
import { SectionHeading } from '../components/common/SectionHeading';
import { ServiceCategoryCard } from '../components/services/ServiceCategoryCard';
import { CtaSection } from '../components/home/CtaSection';
import { SEO } from '../components/common/SEO';
import { ROUTE_SEO, getSiteUrl } from '../utils/seo';
import { cn } from '../utils/cn';

export const ServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'development', label: 'Development & Software' },
    { id: 'digital-growth', label: 'Digital Growth & Marketing' },
    { id: 'ai-automation', label: 'AI & Automation' },
  ];

  const filteredServices =
    selectedCategory === 'all'
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.category === selectedCategory);

  const siteUrl = getSiteUrl();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Software Development and Digital Solutions',
    provider: {
      '@type': 'Organization',
      name: 'USolve',
      url: siteUrl,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'USolve Capabilities',
      itemListElement: SERVICES_DATA.map((s, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.title,
          description: s.shortDescription,
        },
        position: index + 1,
      })),
    },
  };

  return (
    <div>
      <SEO
        title={ROUTE_SEO.services.title}
        description={ROUTE_SEO.services.description}
        path={ROUTE_SEO.services.path}
        structuredData={structuredData}
      />

      {/* Services Hero Header */}
      <section className="pt-12 pb-16 bg-gradient-to-b from-brand-bg via-brand-bg-alt/50 to-brand-bg border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading
            eyebrow="Comprehensive Digital Services"
            title="Practical Software, Marketing & AI Solutions"
            description="We build tailored digital solutions designed to solve real business bottlenecks. Each service is explained below with what it does, who it helps, and the practical problems it eliminates."
            className="mb-8"
          />

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue',
                  selectedCategory === cat.id
                    ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                    : 'bg-white text-brand-slate border-brand-border hover:bg-brand-bg-alt hover:text-brand-navy'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-20 bg-brand-bg-alt/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <ServiceCategoryCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Closing Call to Action */}
      <CtaSection />
    </div>
  );
};
