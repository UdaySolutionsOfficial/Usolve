import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '../../common/Button';
import { Service3DItem } from './service3dData';

interface ServiceDetailModalProps {
  service: Service3DItem | null;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (service) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [service, onClose]);

  if (!service) return null;

  const Icon = service.icon;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-detail-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-navy/60 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-brand-border overflow-hidden max-h-[90vh] flex flex-col z-10"
        >
          {/* Top Bar Header */}
          <div className="bg-brand-bg-alt/80 border-b border-brand-border/80 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs text-white"
                style={{ backgroundColor: service.accentColor }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-slate">
                  {service.category} • {service.badge}
                </span>
                <h3
                  id="service-detail-title"
                  className="text-base sm:text-lg font-bold text-brand-navy leading-snug"
                >
                  {service.title}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="w-8 h-8 rounded-full bg-white hover:bg-brand-bg-alt border border-brand-border flex items-center justify-center text-brand-slate hover:text-brand-navy transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Tagline Banner */}
            <div className="p-4 rounded-xl bg-brand-blue-light/50 border border-brand-blue/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-brand-navy leading-relaxed">
                {service.tagline}
              </p>
            </div>

            {/* Practical Triad Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-brand-bg-alt border border-brand-border/80 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-brand-blue">
                  What It Does
                </div>
                <p className="text-xs text-brand-slate leading-relaxed">
                  {service.whatItDoes}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-brand-bg-alt border border-brand-border/80 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  Who It Helps
                </div>
                <p className="text-xs text-brand-slate leading-relaxed">
                  {service.whoItHelps}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-brand-bg-alt border border-brand-border/80 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
                  Problem It Solves
                </div>
                <p className="text-xs text-brand-slate leading-relaxed">
                  {service.problemItSolves}
                </p>
              </div>
            </div>

            {/* Key Deliverables & Features */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-3">
                Key Technical Deliverables Included
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {service.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-brand-navy bg-white p-2.5 rounded-lg border border-brand-border shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Bottom Action Footer */}
          <div className="bg-brand-bg-alt/60 border-t border-brand-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-brand-slate text-center sm:text-left">
              Have specific requirements for this service? Let's discuss a practical technical roadmap.
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                to={`/contact?service=${encodeURIComponent(service.title)}`}
                variant="primary"
                size="sm"
                icon={<MessageSquare className="w-3.5 h-3.5" />}
                className="flex-1 sm:flex-none justify-center"
              >
                Inquire About This Service
              </Button>
              <Button
                to={`/services#${service.id}`}
                variant="outline"
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                className="flex-1 sm:flex-none justify-center"
              >
                View Full Documentation
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
