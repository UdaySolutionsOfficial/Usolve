import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaqItem } from '../../types';
import { cn } from '../../utils/cn';

interface FaqAccordionProps {
  items: FaqItem[];
  defaultOpenId?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  items,
  defaultOpenId,
}) => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [defaultOpenId || items[0]?.id]: true,
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = !!openIds[item.id];
        return (
          <div
            key={item.id}
            className={cn(
              'border rounded-xl transition-all duration-200 overflow-hidden',
              isOpen
                ? 'bg-white border-brand-blue/30 shadow-card'
                : 'bg-white/80 border-brand-border hover:border-brand-border/90 hover:bg-white shadow-xs'
            )}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-xl"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${item.id}`}
            >
              <div className="flex items-center gap-3 pr-4">
                <span className="text-base sm:text-lg font-bold text-brand-navy">
                  {item.question}
                </span>
              </div>
              <span
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200',
                  isOpen
                    ? 'bg-brand-blue-light text-brand-blue rotate-180'
                    : 'bg-brand-bg-alt text-brand-slate'
                )}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>

            <div
              id={`faq-answer-${item.id}`}
              className={cn(
                'px-6 transition-all duration-200 ease-in-out',
                isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0 overflow-hidden'
              )}
            >
              <div className="pt-3 border-t border-brand-border/60 text-sm sm:text-base text-brand-slate leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
