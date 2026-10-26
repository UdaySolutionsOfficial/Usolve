import React, { useState } from 'react';
import { FAQS_DATA } from '../data/faqs';
import { SectionHeading } from '../components/common/SectionHeading';
import { FaqAccordion } from '../components/faqs/FaqAccordion';
import { CtaSection } from '../components/home/CtaSection';
import { SEO } from '../components/common/SEO';
import { ROUTE_SEO } from '../utils/seo';
import { cn } from '../utils/cn';

export const FaqsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: `All Questions (${FAQS_DATA.length})` },
    { id: 'general', label: 'General & Overview' },
    { id: 'services', label: 'Services & Custom Software' },
    { id: 'process', label: 'Process & Quotations' },
    { id: 'technical', label: 'Technical & AI' },
  ];

  const filteredFaqs =
    activeCategory === 'all'
      ? FAQS_DATA
      : FAQS_DATA.filter((item) => item.category === activeCategory);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS_DATA.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div>
      <SEO
        title={ROUTE_SEO.faqs.title}
        description={ROUTE_SEO.faqs.description}
        path={ROUTE_SEO.faqs.path}
        structuredData={structuredData}
      />

      {/* FAQs Hero */}
      <section className="pt-12 pb-16 bg-gradient-to-b from-brand-bg via-brand-bg-alt/50 to-brand-bg border-b border-brand-border/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading
            eyebrow="Help & Clear Answers"
            title="Frequently Asked Questions"
            description="Find direct, straightforward answers regarding our services, working methodology, custom development capabilities, and how to start a project with USolve."
            className="mb-8"
          />

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue',
                  activeCategory === cat.id
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

      {/* Accordion List */}
      <section className="py-16 sm:py-20 bg-brand-bg-alt/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FaqAccordion items={filteredFaqs} defaultOpenId="services-overview" />
        </div>
      </section>

      <CtaSection />
    </div>
  );
};
