import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { SERVICES_3D_DATA, Service3DItem } from './services3d/service3dData';
import { Service3dVisual } from './services3d/Service3dVisual';
import { ServiceDetailModal } from './services3d/ServiceDetailModal';

export const ServicesOverview: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedService, setSelectedService] = useState<Service3DItem | null>(null);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const activeService = SERVICES_3D_DATA[currentIndex];

  // Navigate to next service
  const handleNext = useCallback(() => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % SERVICES_3D_DATA.length);
  }, []);

  // Navigate to previous service
  const handlePrev = useCallback(() => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + SERVICES_3D_DATA.length) % SERVICES_3D_DATA.length);
  }, []);

  // Keyboard arrow keys navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedService) return; // Ignore if detail modal is open
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, selectedService]);

  // Keep active tab scrolled into view on mobile
  useEffect(() => {
    if (!tabsContainerRef.current) return;
    const activeTab = tabsContainerRef.current.children[currentIndex] as HTMLElement;
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentIndex]);

  // Optional auto-rotation (pauses when user interacts or detail modal is open)
  useEffect(() => {
    if (!isAutoPlaying || selectedService) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, selectedService, handleNext]);

  // 3D Camera Zoom In & Zoom Out Variants
  const cameraVariants = {
    enter: (dir: 'next' | 'prev') => ({
      opacity: 0,
      scale: 0.75,
      z: -300,
      rotateY: dir === 'next' ? 24 : -24,
      rotateX: 8,
      transition: { duration: 0.45, ease: 'easeOut' },
    }),
    center: {
      opacity: 1,
      scale: 1,
      z: 0,
      rotateY: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        stiffness: 240,
        damping: 24,
        mass: 0.6,
      },
    },
    exit: (dir: 'next' | 'prev') => ({
      opacity: 0,
      scale: 0.8,
      z: 250,
      rotateY: dir === 'next' ? -24 : 24,
      rotateX: -8,
      transition: { duration: 0.35, ease: 'easeIn' },
    }),
  };

  return (
    <section
      ref={stageRef}
      id="capabilities"
      aria-label="Our Core Capabilities"
      className="py-16 sm:py-24 bg-gradient-to-b from-brand-bg-alt/70 via-brand-bg to-brand-bg-alt/50 border-b border-brand-border/70 relative overflow-hidden"
    >
      {/* Dynamic Ambient Background Glow that shifts with active service color */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] blur-[120px] rounded-full pointer-events-none opacity-30 transition-colors duration-700"
        style={{ backgroundColor: activeService.accentColor }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <SectionHeading
          eyebrow="Our Core Capabilities"
          title="Digital Services Built for Business Utility"
          description="Explore our complete engineering and creative services with interactive 3D previews. Click any capability to inspect deliverables in depth."
        />

        {/* 3D Service Selector Navigation Tabs */}
        <div className="mb-8 sm:mb-12">
          <div
            ref={tabsContainerRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 sm:justify-center"
            role="tablist"
            aria-label="Service Selector"
          >
            {SERVICES_3D_DATA.map((service, idx) => {
              const Icon = service.icon;
              const isActive = idx === currentIndex;
              return (
                <button
                  key={service.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${service.id}`}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 'next' : 'prev');
                    setCurrentIndex(idx);
                    setIsAutoPlaying(false);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer select-none shrink-0 border ${
                    isActive
                      ? 'bg-brand-navy text-white border-brand-navy shadow-elevated scale-105'
                      : 'bg-white/80 text-brand-slate hover:text-brand-navy border-brand-border hover:border-brand-blue/40 shadow-xs'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-brand-blue-soft' : 'text-brand-slate'
                    }`}
                  />
                  <span>{service.shortTitle}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Camera Stage Viewport */}
        <div className="relative min-h-[520px] sm:min-h-[560px] lg:min-h-[500px] flex items-center justify-center perspective-[1200px]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={activeService.id}
              custom={direction}
              variants={cameraVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Active Service Showcase Card */}
              <div
                className="rounded-3xl bg-white border border-brand-border/90 shadow-2xl overflow-hidden p-6 sm:p-8 lg:p-10 transition-all duration-500"
                style={{
                  boxShadow: `0 25px 50px -12px ${activeService.accentColor}25, 0 10px 20px -6px rgba(20, 39, 68, 0.08)`,
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Left Column: Bold Service Presentation */}
                  <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
                    {/* Eyebrow Status Badges */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs"
                        style={{ backgroundColor: activeService.accentColor }}
                      >
                        {activeService.badge}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-bg-alt text-brand-slate border border-brand-border">
                        {activeService.category}
                      </span>
                      <span className="text-xs font-mono text-brand-slate/70">
                        {String(currentIndex + 1).padStart(2, '0')} / {String(SERVICES_3D_DATA.length).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Service Title */}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
                      {activeService.title}
                    </h3>

                    {/* Dynamic Tagline (What We Provide) */}
                    <p className="text-sm sm:text-base text-brand-slate leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                      {activeService.tagline}
                    </p>

                    {/* Key Technical Highlights Pills */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                      {activeService.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-brand-bg-alt border border-brand-border text-[11px] font-semibold text-brand-navy shadow-2xs"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* In-Place Detail Revealer Action */}
                    <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedService(activeService)}
                        aria-label={`Inspect in-place details for ${activeService.title}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-elevated transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                        style={{ backgroundColor: activeService.accentColor }}
                      >
                        <Eye className="w-4 h-4" />
                        <span>Inspect In-Place Details</span>
                      </button>

                      <Button
                        to={`/contact?service=${encodeURIComponent(activeService.title)}`}
                        variant="outline"
                        size="sm"
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Discuss Project
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: Tailored 3D Visual & Orbiting Elements */}
                  <div
                    onClick={() => setSelectedService(activeService)}
                    className="lg:col-span-6 flex justify-center cursor-pointer group"
                    title="Click to inspect in-place details"
                  >
                    <Service3dVisual service={activeService} />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3D Camera Controls & Scrubber Footer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-brand-border/70">
          {/* Quick Stepper Chevrons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous 3D service"
              className="w-10 h-10 rounded-xl bg-white hover:bg-brand-bg-alt border border-brand-border flex items-center justify-center text-brand-navy shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next 3D service"
              className="w-10 h-10 rounded-xl bg-white hover:bg-brand-bg-alt border border-brand-border flex items-center justify-center text-brand-navy shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-brand-slate ml-2">
              Use arrow keys or swipe to navigate
            </span>
          </div>

          {/* Stepper Dots Bar */}
          <div className="flex items-center gap-1.5">
            {SERVICES_3D_DATA.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to service ${idx + 1}`}
                onClick={() => {
                  setDirection(idx > currentIndex ? 'next' : 'prev');
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-8 bg-brand-navy'
                    : 'w-2 bg-brand-border hover:bg-brand-slate'
                }`}
              />
            ))}
          </div>

          {/* Link to Full Documentation */}
          <div>
            <Button
              to="/services"
              variant="outline"
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5 text-brand-blue" />}
            >
              All 13 Services Overview
            </Button>
          </div>
        </div>
      </div>

      {/* In-Place Detailed Modal Reveal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </section>
  );
};
