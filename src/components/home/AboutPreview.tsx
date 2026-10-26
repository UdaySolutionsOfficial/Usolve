import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { COMPANY_INFO } from '../../data/company';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const AboutPreview: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-brand-bg-alt/40 border-b border-brand-border/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <Badge variant="blue" dot>
              About USolve
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
              Code Meets Creativity.
            </h2>
            <p className="text-base sm:text-lg text-brand-slate leading-relaxed">
              {COMPANY_INFO.shortIntro}
            </p>
            <p className="text-sm sm:text-base text-brand-slate leading-relaxed">
              We started USolve to help businesses avoid the frustration of slow, bloated software and overpriced, generic web templates. By pairing clear engineering logic with thoughtful visual design, we build digital products that serve real business needs from day one.
            </p>

            <div className="pt-2">
              <Button
                to="/about"
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Learn More About Our Team & Mission
              </Button>
            </div>
          </div>

          {/* Right Summary Card / Leadership Snapshot */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-card hover:shadow-card-hover transition-shadow space-y-6">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                  Company Leadership
                </h3>
                <span className="text-[11px] font-semibold text-brand-blue bg-brand-blue-light/70 px-2 py-0.5 rounded">
                  Executive Team
                </span>
              </div>

              <div className="space-y-5">
                {COMPANY_INFO.founders.map((founder, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    {founder.image ? (
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className="w-14 h-14 rounded-xl object-cover object-top border border-brand-border/80 shadow-xs shrink-0 bg-brand-bg-alt"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-blue-light to-brand-bg-alt text-brand-blue font-extrabold font-heading text-lg flex items-center justify-center border border-brand-blue/20 shrink-0 shadow-xs">
                        {founder.initials}
                      </div>
                    )}
                    <div>
                      <div className="text-base font-bold text-brand-navy">{founder.name}</div>
                      <div className="text-xs font-semibold text-brand-blue">{founder.role}</div>
                      <div className="text-xs text-brand-slate mt-1 leading-relaxed">{founder.bio}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-brand-border flex items-center justify-between text-xs text-brand-slate">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Direct Founder Collaboration
                </span>
                <span className="text-brand-navy font-semibold">India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
