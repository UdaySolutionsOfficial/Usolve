import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { HeroIllustration } from './HeroIllustration';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 lg:pt-16 lg:pb-28 bg-gradient-to-b from-brand-bg via-brand-bg-alt/50 to-brand-bg border-b border-brand-border/70">
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 hero-grid-pattern opacity-40 pointer-events-none" />

      {/* Soft Ambient Radial Blur Accents */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left Content Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <Badge variant="blue" dot>
                  Software Development & Digital Solutions
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-[3.75rem] font-extrabold text-brand-navy tracking-tight leading-[1.12]">
                We build digital solutions that move your business forward.
              </h1>
            </div>

            <p className="text-base sm:text-lg md:text-xl text-brand-slate leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              From websites and custom software to AI-powered systems and digital marketing, we help businesses turn ideas into practical solutions.
            </p>

            {/* Prominent Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-4 pt-2">
              <Button
                to="/contact"
                size="lg"
                variant="primary"
                className="w-full sm:w-auto text-base shadow-sm hover:shadow-md transition-shadow"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Let's Talk About Your Project
              </Button>
              <Button
                to="/work"
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base"
              >
                Explore Our Work
              </Button>
            </div>

            {/* Value Indicators Bar */}
            <div className="pt-6 sm:pt-8 border-t border-brand-border/70 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-brand-blue-light text-brand-blue flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-brand-navy">Modern Light Design</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-brand-blue-light text-brand-blue flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-brand-navy">Fast & Usable Systems</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-brand-blue-light text-brand-blue flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-brand-navy">Grounded Technology</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Column */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
};
