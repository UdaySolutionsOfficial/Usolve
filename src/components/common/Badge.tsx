import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'navy' | 'gray' | 'success';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  className,
  dot = false,
}) => {
  const variants = {
    blue: 'bg-brand-blue-light text-brand-blue border-brand-blue/20',
    navy: 'bg-brand-navy/5 text-brand-navy border-brand-navy/15',
    gray: 'bg-brand-bg-alt text-brand-slate border-brand-border',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const dotColors = {
    blue: 'bg-brand-blue',
    navy: 'bg-brand-navy',
    gray: 'bg-brand-slate',
    success: 'bg-emerald-500',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border',
        variants[variant],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])} />}
      {children}
    </span>
  );
};
