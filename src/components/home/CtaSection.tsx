import React from 'react';
import { ArrowRight, Mail, Phone, MessageSquare } from 'lucide-react';
import { COMPANY_INFO } from '../../data/company';
import { Button } from '../common/Button';

export const CtaSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-brand-bg-alt/40 via-brand-bg-alt to-brand-bg-alt/80 border-b border-brand-border/70 relative overflow-hidden">
      {/* Decorative subtle background grid */}
      <div className="absolute inset-0 hero-grid-pattern opacity-30 pointer-events-none" />

      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="bg-white rounded-3xl border border-brand-border p-8 sm:p-12 md:p-16 shadow-elevated">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-brand-blue-light text-brand-blue border border-brand-blue/20 mb-5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Start Your Project</span>
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
            Have an idea? Let's build something useful.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-brand-slate max-w-2xl mx-auto leading-relaxed">
            Tell us what you're planning, and let's explore how USolve can help you bring it to life with clean code and thoughtful design.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              to="/contact"
              size="lg"
              variant="primary"
              className="w-full sm:w-auto shadow-sm hover:shadow-md"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Let's Talk About Your Project
            </Button>
            <Button
              href={`mailto:${COMPANY_INFO.email}`}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              icon={<Mail className="w-4 h-4" />}
            >
              Email Us Directly
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-brand-border/70 flex flex-wrap items-center justify-center gap-6 text-xs text-brand-slate">
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="hover:text-brand-blue transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-brand-blue" />
              <span>{COMPANY_INFO.email}</span>
            </a>
            <span className="hidden sm:inline text-brand-border">•</span>
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="hover:text-brand-blue transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-brand-blue" />
              <span>{COMPANY_INFO.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
