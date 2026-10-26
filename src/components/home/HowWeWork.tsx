import React from 'react';
import { COMPANY_INFO } from '../../data/company';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { Check } from 'lucide-react';

export const HowWeWork: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-white border-b border-brand-border/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Process"
          title="How We Turn Ideas into Reliable Products"
          description="A straightforward, four-step development lifecycle that keeps you informed, minimizes unexpected delays, and ensures high quality."
        />

        {/* Step Cards with Connected Indicators */}
        <div className="relative">
          {/* Subtle Horizontal Connector Bar on Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-brand-blue/20 via-brand-blue/40 to-brand-blue/20 -translate-y-8 pointer-events-none z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {COMPANY_INFO.workingSteps.map((stepItem, idx) => (
              <Card
                key={idx}
                variant="white"
                padding="md"
                className="relative flex flex-col justify-between border border-brand-border shadow-card hover:shadow-card-hover hover:border-brand-blue/30 transition-all duration-300 h-full group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-brand-blue-light text-brand-blue font-extrabold flex items-center justify-center font-heading text-base group-hover:bg-brand-blue group-hover:text-white transition-colors duration-200">
                      {stepItem.step}
                    </span>
                    <span className="text-[10px] font-bold text-brand-slate uppercase tracking-wider">
                      Stage {idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-navy mb-2.5 group-hover:text-brand-blue transition-colors duration-150">
                    {stepItem.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-brand-border/60 flex items-center gap-1.5 text-[11px] font-semibold text-brand-blue">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Structured milestone review</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
