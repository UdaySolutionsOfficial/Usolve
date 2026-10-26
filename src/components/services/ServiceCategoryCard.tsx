import React from 'react';
import {
  Globe,
  Layers,
  Code,
  Cpu,
  Smartphone,
  ShoppingBag,
  TrendingUp,
  Megaphone,
  Search,
  Palette,
  Bot,
  Headphones,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { ServiceItem } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface ServiceCategoryCardProps {
  service: ServiceItem;
}

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Layers,
  Code,
  Cpu,
  Smartphone,
  ShoppingBag,
  TrendingUp,
  Megaphone,
  Search,
  Palette,
  Bot,
  Headphones,
  ShieldCheck,
};

export const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({ service }) => {
  const Icon = iconMap[service.iconName] || Code;

  return (
    <Card
      id={service.id}
      variant="white"
      padding="lg"
      className="flex flex-col justify-between border border-brand-border shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div>
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-brand-navy">
            {service.title}
          </h3>
        </div>

        <p className="text-sm sm:text-base text-brand-slate font-medium mb-6">
          {service.shortDescription}
        </p>

        {/* 3 Practical Explanations */}
        <div className="space-y-4 pt-4 border-t border-brand-border/60">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-1">
              What it does:
            </div>
            <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
              {service.whatItDoes}
            </p>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-1">
              Who it helps:
            </div>
            <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
              {service.whoItHelps}
            </p>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-1">
              Problem it solves:
            </div>
            <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
              {service.problemItSolves}
            </p>
          </div>
        </div>

        {/* Features Pills */}
        <div className="mt-6 pt-4 border-t border-brand-border/60">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-2.5">
            Key Inclusions:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {service.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-brand-slate">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-brand-border/70 flex items-center justify-between">
        <Button
          to={`/contact?service=${encodeURIComponent(service.title)}`}
          variant="outline"
          size="sm"
          className="w-full justify-between"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Discuss {service.title}
        </Button>
      </div>
    </Card>
  );
};
