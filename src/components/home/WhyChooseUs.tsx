import React from 'react';
import { Target, Layout, Wrench, Gauge, MessageCircle, LifeBuoy, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      title: 'Solutions Built Around Business Needs',
      description:
        'We start by analyzing how your business operates, ensuring software and websites fit your real workflows instead of forcing you into rigid templates.',
      icon: Target,
      tag: 'Pragmatic',
    },
    {
      title: 'Clean & User-Friendly Design',
      description:
        'We specialize in light-theme, uncluttered interfaces where typography, spacing, and intuitive layouts help visitors find information easily.',
      icon: Layout,
      tag: 'Clarity',
    },
    {
      title: 'Practical Technology Choices',
      description:
        'We select mature, proven frameworks and libraries rather than over-engineering simple problems with unnecessary complexity.',
      icon: Wrench,
      tag: 'Reliability',
    },
    {
      title: 'Focus on Performance & Usability',
      description:
        'Fast loading speeds, mobile responsiveness, and accessible navigation are prioritized in every project to ensure high usability.',
      icon: Gauge,
      tag: 'Speed',
    },
    {
      title: 'Clear, Direct Communication',
      description:
        'You collaborate directly with our engineering and design team. We provide clear milestone updates and straightforward explanations.',
      icon: MessageCircle,
      tag: 'Transparency',
    },
    {
      title: 'Support for Improving Digital Products',
      description:
        'Launching is just the beginning. We support our clients with updates, maintenance, and regular improvements as their companies grow.',
      icon: LifeBuoy,
      tag: 'Longevity',
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-brand-bg-alt/50 border-b border-brand-border/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Choose USolve"
          title="A Grounded Approach to Software Development"
          description="We avoid marketing buzzwords and exaggerated claims. Our focus is delivering reliable, well-designed digital solutions that support your business operations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <Card
                key={idx}
                variant="white"
                padding="md"
                className="flex flex-col justify-between border border-brand-border shadow-card hover:shadow-card-hover hover:border-brand-blue/30 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-brand-blue bg-brand-blue-light/70 px-2.5 py-0.5 rounded-full border border-brand-blue/20">
                      {pt.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-brand-navy mb-2">
                    {pt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                    {pt.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-brand-border/60 flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified engineering standard</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
