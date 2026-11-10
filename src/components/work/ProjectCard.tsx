import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Layers,
  Lock,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { ProjectItem } from '../../types';

interface ProjectCardProps {
  project: ProjectItem;
  onOpenDetails?: (project: ProjectItem) => void;
  defaultOpen?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenDetails,
  defaultOpen = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Gallery Images Array (fallback to single imageSrc if empty)
  const images =
    project.galleryImages && project.galleryImages.length > 0
      ? project.galleryImages
      : project.imageSrc
      ? [project.imageSrc]
      : [];

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(defaultOpen);
  const [rippleOrigin, setRippleOrigin] = useState({ x: 150, y: 350 });

  // 3D Tilt & Glare State
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const cleanDomain = project.liveUrl.replace('https://', '').replace(/\/$/, '');

  // 3D Tilt Handler for Desktop Hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDetailsOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3.5;
    const rotateY = ((x - centerX) / centerX) * 3.5;
    setTilt({ rotateX, rotateY });

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // Gallery Navigation
  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length <= 1) return;
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length <= 1) return;
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Trigger Ripple Animation from Click Coordinates
  const handleOpenDetails = (e: React.MouseEvent<HTMLElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRippleOrigin({ x, y });
    }
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsDetailsOpen(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.4s ease-out',
      }}
      className="group relative bg-white/95 backdrop-blur-xl border border-brand-border/80 hover:border-brand-blue/50 rounded-2xl sm:rounded-3xl shadow-[0_15px_40px_rgba(20,39,68,0.07)] hover:shadow-[0_25px_60px_rgba(36,91,204,0.14)] transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Specular Glare Follows Cursor */}
      {isHovered && !isDetailsOpen && (
        <div
          className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 350px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 70%)`,
          }}
        />
      )}

      {/* Browser Window Frame Header */}
      <div className="bg-brand-bg-alt/90 border-b border-brand-border/70 px-4 py-2.5 flex items-center justify-between text-xs relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        </div>

        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-brand-border/80 hover:border-brand-blue/50 text-[11px] font-mono text-brand-navy transition-colors truncate max-w-[180px] shadow-2xs group/link"
          title={`Visit ${cleanDomain}`}
        >
          <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
          <span className="truncate">{cleanDomain}</span>
          <ArrowUpRight className="w-3 h-3 text-brand-slate group-hover/link:text-brand-blue shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </a>

        {/* Gallery Screen Counter */}
        <div className="flex items-center gap-1 text-[11px] font-semibold text-brand-slate bg-brand-bg-alt px-2 py-0.5 rounded-full border border-brand-border/70">
          <Layers className="w-3 h-3 text-brand-blue" />
          <span>
            {activeImgIndex + 1}/{images.length}
          </span>
        </div>
      </div>

      {/* Stacked Gallery Canvas Area */}
      <div
        className="relative aspect-[16/10] bg-slate-900/5 p-3 sm:p-4 overflow-hidden select-none cursor-pointer flex items-center justify-center"
        onClick={() => nextImage()}
        title="Click to view next screen in gallery"
      >
        {/* Background Stacked Photo Cards Effect */}
        {images.length > 1 && (
          <>
            {/* Card Layer 3 (deepest) */}
            {images.length > 2 && (
              <div
                className="absolute inset-x-5 top-5 bottom-2 rounded-xl bg-slate-200/90 border border-brand-border/60 shadow-xs pointer-events-none transition-transform duration-300 ease-out origin-bottom"
                style={{
                  transform: isHovered
                    ? 'rotate(-4deg) translateY(6px) scale(0.92)'
                    : 'rotate(-2deg) translateY(4px) scale(0.94)',
                }}
              />
            )}

            {/* Card Layer 2 (middle) */}
            <div
              className="absolute inset-x-4 top-4 bottom-2.5 rounded-xl bg-slate-100 border border-brand-border/70 shadow-sm pointer-events-none transition-transform duration-300 ease-out origin-bottom"
              style={{
                transform: isHovered
                  ? 'rotate(3.5deg) translateY(4px) scale(0.96)'
                  : 'rotate(1.5deg) translateY(2px) scale(0.97)',
              }}
            />
          </>
        )}

        {/* Active Front Card in Stack */}
        <div className="relative w-full h-full rounded-xl overflow-hidden border border-brand-border/90 bg-white shadow-md transition-transform duration-300 group-hover:scale-[1.01]">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImgIndex}
              src={images[activeImgIndex]}
              alt={`${project.name} screen ${activeImgIndex + 1}`}
              initial={{ opacity: 0.6, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.4, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
          </AnimatePresence>

          {/* Subtle Glass Gradient Lighting */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

          {/* Gallery Navigation Chevrons on Hover */}
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <button
                type="button"
                onClick={prevImage}
                className="pointer-events-auto p-1.5 rounded-full bg-white/90 text-brand-navy shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all"
                aria-label="Previous screen"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="pointer-events-auto p-1.5 rounded-full bg-white/90 text-brand-navy shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all"
                aria-label="Next screen"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Bottom Dot Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5 pointer-events-none">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeImgIndex
                      ? 'w-5 bg-white shadow-xs'
                      : 'w-1.5 bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Bottom: Simple, Professional Project Bar */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow bg-white relative z-10 border-t border-brand-border/60">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-blue">
            {project.category}
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-brand-navy tracking-tight leading-snug mt-0.5">
            {project.name}
          </h3>
        </div>

        {/* Small Sleek Action Row */}
        <div className="pt-3.5 mt-3 border-t border-brand-border/50 flex items-center justify-between gap-2">
          {/* Ripple Reveal Trigger Button */}
          <button
            type="button"
            onClick={handleOpenDetails}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold shadow-xs hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group/btn"
          >
            <span>View Project Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>

          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg bg-brand-bg-alt hover:bg-brand-blue-light text-brand-navy hover:text-brand-blue text-xs font-medium border border-brand-border/80 transition-colors"
            title={`Open ${project.name} in a new tab`}
          >
            <span className="hidden sm:inline">Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-brand-slate group-hover:text-brand-blue" />
          </a>
        </div>
      </div>

      {/* Ripple Animation Details Reveal Overlay */}
      <motion.div
        initial={false}
        animate={{
          clipPath: isDetailsOpen
            ? `circle(150% at ${rippleOrigin.x}px ${rippleOrigin.y}px)`
            : `circle(0% at ${rippleOrigin.x}px ${rippleOrigin.y}px)`,
        }}
        transition={{
          type: 'spring',
          damping: 24,
          stiffness: 180,
        }}
        style={{
          pointerEvents: isDetailsOpen ? 'auto' : 'none',
        }}
        className="absolute inset-0 z-30 bg-gradient-to-br from-[#0E1C33] via-[#142744] to-[#0A1628] text-white p-5 sm:p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
      >
        {/* Glow Ambient Lights inside Ripple Panel */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-blue/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header inside Ripple Panel */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">
              {project.category}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCloseDetails}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors flex items-center gap-1 text-xs px-2"
            aria-label="Back to Gallery"
          >
            <X className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">Close</span>
          </button>
        </div>

        {/* Limited, High-Impact Details Body */}
        <div className="py-4 space-y-3 relative z-10">
          <div>
            <h4 className="text-xl font-extrabold text-white tracking-tight leading-snug">
              {project.name}
            </h4>
            {project.tagline && (
              <p className="text-xs font-semibold text-cyan-300 mt-0.5">
                {project.tagline}
              </p>
            )}
          </div>

          {/* Concise 1-2 sentence core deliverable */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {project.shortSummary}
          </p>

          {/* Key Deliverables (Limited to 2 clean bullets) */}
          <div className="space-y-1.5 pt-1">
            {project.verifiedDetails.slice(0, 2).map((detail, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{detail}</span>
              </div>
            ))}
          </div>

          {/* Compact Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techStack.map((tech, i) => (
              <span
                key={i}
                className="text-[10px] font-medium text-cyan-200 bg-white/[0.08] px-2 py-0.5 rounded border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Ripple Panel Action Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 relative z-10">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-md shadow-brand-blue/40 transition-all duration-200"
          >
            <span>Visit Live Platform</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {onOpenDetails && (
            <button
              type="button"
              onClick={() => onOpenDetails(project)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Inspect Full Technical Scope in Modal"
            >
              <Info className="w-4 h-4 text-cyan-300" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
