import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'white' | 'alt' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'white',
  padding = 'md',
  ...props
}) => {
  const variants = {
    white: 'bg-white border-brand-border shadow-card',
    alt: 'bg-brand-bg-alt border-brand-border/80 shadow-card',
    interactive:
      'bg-white border-brand-border shadow-card hover:shadow-card-hover hover:border-brand-blue/30 transition-all duration-300 transform-gpu hover:-translate-y-1',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-7',
    lg: 'p-8 sm:p-10',
  };

  return (
    <div
      className={cn('rounded-xl border relative overflow-hidden', variants[variant], paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
};
