import React from 'react';
import { COMPANY_INFO } from '../data/company';
import { SectionHeading } from '../components/common/SectionHeading';
import { FounderCard } from '../components/about/FounderCard';
import { Card } from '../components/common/Card';
import { CtaSection } from '../components/home/CtaSection';
import { SEO } from '../components/common/SEO';
import { ROUTE_SEO, getOrganizationSchema } from '../utils/seo';
import { ShieldCheck, HeartHandshake, Compass, RefreshCw, Check } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const valueIcons = [Compass, ShieldCheck, HeartHandshake, RefreshCw];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About USolve',
    description: ROUTE_SEO.about.description,
    mainEntity: getOrganizationSchema(),
  };

  return (
    <div>
      <SEO
        title={ROUTE_SEO.about.title}
        description={ROUTE_SEO.about.description}
        path={ROUTE_SEO.about.path}
        structuredData={structuredData}
      />

      {/* About Hero */}
      <section className="pt-12 pb-16 bg-gradient-to-b from-brand-bg via-brand-bg-alt/50 to-brand-bg border-b border-brand-border/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading
            eyebrow="Our Story & Philosophy"
            title="Code Meets Creativity"
            description={COMPANY_INFO.shortIntro}
            className="mb-0"
          />
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 sm:py-20 bg-white border-b border-brand-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card variant="alt" padding="lg" className="border border-brand-border/80 shadow-card">
              <div className="w-12 h-12 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center font-bold mb-4 font-heading text-lg shadow-xs">
                M
              </div>
              <h3 className="text-2xl font-extrabold text-brand-navy mb-3">Our Mission</h3>
              <p className="text-sm sm:text-base text-brand-slate leading-relaxed">
                {COMPANY_INFO.mission}
              </p>
            </Card>

            <Card variant="alt" padding="lg" className="border border-brand-border/80 shadow-card">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4 font-heading text-lg shadow-xs">
                V
              </div>
              <h3 className="text-2xl font-extrabold text-brand-navy mb-3">Our Vision</h3>
              <p className="text-sm sm:text-base text-brand-slate leading-relaxed">
                {COMPANY_INFO.vision}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 sm:py-20 bg-brand-bg-alt/40 border-b border-brand-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Guiding Principles"
            title="Core Values That Guide Every Build"
            description="We build software with transparency, technical care, and honest collaboration at the center of our work."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMPANY_INFO.values.map((val, idx) => {
              const Icon = valueIcons[idx] || ShieldCheck;
              return (
                <Card
                  key={idx}
                  variant="white"
                  padding="md"
                  className="border border-brand-border shadow-card flex flex-col justify-between hover:shadow-card-hover transition-all duration-300"
                >
                  <div>
                    <div className="w-11 h-11 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-brand-navy mb-2">
                      {val.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership / Founders Section */}
      <section className="py-16 sm:py-20 bg-white border-b border-brand-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Company Leadership"
            title="Meet the Founders Behind USolve"
            description="Direct technical guidance, transparent communication, and dedicated craftsmanship from day one."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {COMPANY_INFO.founders.map((founder, idx) => (
              <FounderCard key={idx} founder={founder} />
            ))}
          </div>
        </div>
      </section>

      {/* Working Approach Steps */}
      <section className="py-16 sm:py-20 bg-brand-bg-alt/30 border-b border-brand-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Execution Model"
            title="How We Collaborate With Clients"
            description="From the first consultation to post-launch maintenance, our process ensures you always know what is being built and why."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMPANY_INFO.workingSteps.map((step, idx) => (
              <Card key={idx} variant="white" padding="md" className="border border-brand-border shadow-card flex flex-col justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-brand-blue/30 font-heading block mb-2">
                    {step.step}
                  </span>
                  <h4 className="text-base font-bold text-brand-navy mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-brand-border/60 flex items-center gap-1.5 text-[11px] text-brand-blue font-semibold">
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Verified Stage</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
};
