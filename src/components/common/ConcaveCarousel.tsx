import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ConcaveCarouselItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  category?: string;
  image: string;
  link: string;
}

export interface ConcaveCarouselProps {
  items: ConcaveCarouselItem[];
  startIndex?: number;
  curvature?: number; // 0 (flat) to 1 (tight drum), default 0.72
  distance?: number; // distance in panel heights, default 4
  tilt?: number; // vertical tilt in degrees, default 0
  gap?: number; // gap between panels in px, default 16
  radius?: number; // corner radius in px, default 18
  reflection?: number; // reflection opacity, default 0.12
  dim?: number; // edge dimming factor, default 0.35
  scrollDriven?: boolean;
  className?: string;
}

export const ConcaveCarousel: React.FC<ConcaveCarouselProps> = ({
  items,
  startIndex = 3, // Start on a visually centered card
  curvature = 0.72,
  distance = 3.8,
  tilt = 0,
  gap = 16,
  radius = 18,
  reflection = 0.12,
  dim = 0.35,
  scrollDriven = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [currentIndex, setCurrentIndex] = useState<number>(startIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartIndex, setDragStartIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1200);

  // Measure viewport size for responsive panel sizes
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Panel sizing: aspect ratio ~ 1.25 to 1.3 matching reference video
  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;
  const panelWidth = isMobile ? 290 : isTablet ? 360 : 420;
  const panelHeight = Math.round(panelWidth / 1.28); // e.g. 420 / 1.28 = 328px

  // Scroll-linked horizontal movement:
  // As the user scrolls vertically through the parent section, the carousel moves horizontally
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const scrollTargetIndex = useTransform(scrollYProgress, [0, 1], [0, items.length - 1]);
  const smoothIndex = useSpring(scrollTargetIndex, {
    stiffness: 85,
    damping: 22,
    mass: 0.35,
  });

  useEffect(() => {
    if (!scrollDriven || shouldReduceMotion) return;
    const unsub = smoothIndex.on('change', (val) => {
      if (!isDragging) {
        setCurrentIndex(val);
      }
    });
    return () => unsub();
  }, [smoothIndex, scrollDriven, isDragging, shouldReduceMotion]);

  // Pointer drag gestures
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartIndex(currentIndex);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    const pxPerCard = panelWidth + gap;
    const newIdx = dragStartIndex - deltaX / pxPerCard;
    setCurrentIndex(Math.max(-0.2, Math.min(items.length - 0.8, newIdx)));
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Snap to nearest integer
    setCurrentIndex((prev) => Math.max(0, Math.min(items.length - 1, Math.round(prev))));
  };

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(items.length - 1, Math.round(prev) + 1));
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, Math.round(prev) - 1));
  }, []);

  // 3D Geometry calculations matching reference video
  // Concave curve: Radius R forms a cylinder curving around the viewer
  const baseRadius = isMobile ? 680 : isTablet ? 880 : 1080;
  const cylinderRadius = baseRadius / Math.max(0.3, curvature);
  // Angular step between adjacent panels in degrees
  const angleStepDeg = ((panelWidth + gap) / cylinderRadius) * (180 / Math.PI);
  // Perspective distance
  const perspectivePx = distance * panelHeight;

  // Active rounded index for counter and caption focus
  const activeRoundedIdx = Math.max(0, Math.min(items.length - 1, Math.round(currentIndex)));

  return (
    <div
      ref={containerRef}
      className={`relative w-full select-none overflow-hidden ${className}`}
    >
      {/* 3D Perspective Stage Viewport */}
      <div
        className="relative w-full pt-4 pb-2 sm:pt-6 flex flex-col items-center justify-center"
        style={{
          perspective: `${perspectivePx}px`,
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Curved 3D Gallery Drum */}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
          style={{
            width: `${panelWidth}px`,
            height: `${panelHeight}px`,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt}deg)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          {items.map((item, index) => {
            const delta = index - currentIndex;
            const angleDeg = delta * angleStepDeg;
            const angleRad = (angleDeg * Math.PI) / 180;

            // Mathematical Concave Cylinder Transformation:
            // Center is at (0, 0). Side cards curve FORWARD towards viewer (Z > 0)
            // and turn their faces inward to the center (rotateY = -angleDeg)
            const x = cylinderRadius * Math.sin(angleRad);
            const z = cylinderRadius * (1 - Math.cos(angleRad)) * 0.62;
            const rotateY = -angleDeg;

            // Visual dimming and edge fading matching reference video
            const absDelta = Math.abs(delta);
            const cardOpacity = Math.max(0.2, 1 - Math.min(0.85, absDelta * dim * 0.75));
            const cardBrightness = Math.max(0.65, 1 - Math.min(0.35, absDelta * 0.12));
            const zIndex = Math.round(100 - absDelta * 8);

            // Caption visibility under each card
            const captionOpacity = Math.max(0, 1 - absDelta * 1.35);

            // Hide cards beyond 3.8 panels to keep performance buttery smooth
            if (absDelta > 3.9) return null;

            return (
              <div
                key={item.id}
                onClick={(e) => {
                  if (absDelta > 0.4) {
                    e.preventDefault();
                    setCurrentIndex(index);
                  }
                }}
                className="absolute inset-0 flex flex-col items-center group will-change-transform"
                style={{
                  width: `${panelWidth}px`,
                  height: `${panelHeight}px`,
                  transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg)`,
                  opacity: cardOpacity,
                  filter: `brightness(${cardBrightness})`,
                  zIndex,
                  transformStyle: 'preserve-3d',
                  transition: isDragging
                    ? 'none'
                    : 'transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.25s ease-out',
                }}
              >
                {/* 3D Depth Card (Full-Bleed Image Panel) */}
                <Link
                  to={item.link}
                  className="relative w-full h-full block rounded-[18px] sm:rounded-[22px] overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{
                    borderRadius: `${radius}px`,
                    boxShadow: '0 20px 45px -12px rgba(20, 39, 68, 0.22), 0 8px 16px -4px rgba(20, 39, 68, 0.12)',
                  }}
                >
                  {/* Full-bleed 3D Render Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Subtle Top Gradient for Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/30 pointer-events-none" />

                  {/* Top-Left USolve Logo Watermark */}
                  <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-navy/80 backdrop-blur-md border border-white/20 shadow-sm text-white">
                    <img
                      src="/assets/brand/logo/logo-usolve-transparent.png"
                      alt="USolve"
                      className="w-4 h-4 object-contain brightness-0 invert"
                    />
                    <span className="text-[11px] font-bold tracking-wider font-heading">USolve</span>
                  </div>

                  {/* Top-Right Category Badge */}
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 text-brand-navy border border-white/40 shadow-sm backdrop-blur-sm">
                      {item.badge}
                    </span>
                  </div>

                  {/* Bottom View Capability Action Pill (visible on hover) */}
                  <div className="absolute bottom-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-blue text-white shadow-md">
                      <span>Explore</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </Link>

                {/* React Bits Pro Floor Reflection Effect */}
                {reflection > 0 && (
                  <div
                    aria-hidden="true"
                    className="absolute top-full left-0 right-0 overflow-hidden pointer-events-none select-none mt-2"
                    style={{
                      height: `${panelHeight * 0.38}px`,
                      transform: 'scaleY(-1)',
                      opacity: reflection * (1 - absDelta * 0.22),
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 80%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 80%)',
                      filter: 'blur(2px)',
                    }}
                  >
                    <div
                      className="w-full h-full rounded-[18px] sm:rounded-[22px] overflow-hidden"
                      style={{ borderRadius: `${radius}px` }}
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
                )}

                {/* Caption Directly Under Card (Identical to Reference Video) */}
                <div
                  className="w-full text-center mt-5 sm:mt-6 select-none pointer-events-none transition-opacity duration-200"
                  style={{
                    opacity: captionOpacity,
                    transform: `translateY(${absDelta * 4}px)`,
                  }}
                >
                  <h3 className="text-base sm:text-lg font-bold text-brand-navy tracking-tight drop-shadow-xs line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-slate mt-1 line-clamp-1 max-w-sm mx-auto">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Controls (< 04 / 08 >) Exact Style as Reference Video */}
        <div className="relative z-30 mt-20 sm:mt-24 flex items-center justify-center gap-4 sm:gap-6">
          {/* Previous Button */}
          <button
            type="button"
            onClick={goToPrev}
            disabled={activeRoundedIdx <= 0}
            aria-label="Previous service"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-brand-border/90 shadow-sm hover:shadow hover:bg-brand-bg-alt flex items-center justify-center text-brand-navy hover:text-brand-blue disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Counter (e.g. 04 / 08) */}
          <div className="font-mono text-xs sm:text-sm font-semibold text-brand-slate tracking-widest px-2">
            <span>{String(activeRoundedIdx + 1).padStart(2, '0')}</span>
            <span className="mx-1.5 text-brand-slate/40">/</span>
            <span>{String(items.length).padStart(2, '0')}</span>
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={goToNext}
            disabled={activeRoundedIdx >= items.length - 1}
            aria-label="Next service"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-brand-border/90 shadow-sm hover:shadow hover:bg-brand-bg-alt flex items-center justify-center text-brand-navy hover:text-brand-blue disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
