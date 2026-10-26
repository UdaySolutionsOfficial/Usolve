import React from 'react';
import { FounderItem } from '../../types';
import { Card } from '../common/Card';

interface FounderCardProps {
  founder: FounderItem;
}

export const FounderCard: React.FC<FounderCardProps> = ({ founder }) => {
  return (
    <Card
      variant="white"
      padding="lg"
      className="flex flex-col h-full border border-brand-border shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        {/* Founder Photograph or Executive Monogram */}
        {founder.image ? (
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-brand-border/80 shadow-xs shrink-0 bg-brand-bg-alt">
            <img
              src={founder.image}
              alt={founder.name}
              width="128"
              height="128"
              loading="lazy"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-brand-blue-light via-brand-bg-alt to-brand-blue-soft border-2 border-brand-border flex items-center justify-center shrink-0 shadow-xs">
            <span className="text-3xl font-extrabold text-brand-blue font-heading tracking-tight">
              {founder.initials}
            </span>
          </div>
        )}

        <div className="space-y-2.5 flex-grow">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-brand-navy">
                {founder.name}
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-bold text-brand-blue uppercase tracking-wider mt-0.5">
              {founder.role}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-brand-slate leading-relaxed pt-1">
            {founder.bio}
          </p>

          <div className="pt-3 border-t border-brand-border/60">
            <div className="text-[11px] font-bold text-brand-navy uppercase tracking-wider mb-2">
              Core Responsibilities:
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
              {founder.focusAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium text-brand-slate bg-brand-bg-alt px-2.5 py-1 rounded-md border border-brand-border"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
