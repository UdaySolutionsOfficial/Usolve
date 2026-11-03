import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ConcaveCarouselItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  category?: string;
  image: string;
  link: string;
  features?: string[];
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ConcaveCarouselProps {
  items: ConcaveCarouselItem[];
  startIndex?: number;
  curvature?: number; // 0 (flat strip) to 1 (tight drum), default 0.72
  distance?: number; // viewer distance in panel heights, default 4
  tilt?: number; // viewing angle in degrees, default 0
  gap?: number; // space between panels in px, default 20
  radius?: number; // corner radius in px, default 20
  reflection?: number; // floor reflection strength (0 to 0.2), default 0.08
  dim?: number; // edge fade/dimming, default 0.35
  autoplay?: 'drift' | 'step' | 'off';
  speed?: number; // drift speed in panels/sec, default 0.16
  interval?: number; // interval in seconds for 'step' autoplay
  scrollDriven?: boolean; // enable scroll-linked horizontal movement
  className?: string;
}

export const ConcaveCarousel: React.FC<ConcaveCarouselProps> = ({
  items,
  startIndex = 0,
  curvature = 0.72,
  distance = 4,
  tilt = 0,
  gap = 20,
  radius = 20,
  reflection = 0.08,
  dim = 0.35,
  autoplay = 'drift',
  speed = 0.14,
  interval = 4,
  scrollDriven = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Active floating index (can be fractional during smooth transitions)
  const [currentIndex, setCurrentIndex] = useState<number>(startIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartIndex, setDragStartIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1200);

  // Measure viewport size for responsive 3D radius and panel widths
  useEffect(() => {
    const updateWidth = () => {
      setViewportWidth(window.innerWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Scroll-driven horizontal movement:
  // Tracks scroll progress through the parent section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const scrollIndexRaw = useTransform(scrollYProgress, [0, 1], [0, items.length - 1]);
  const smoothScrollIndex = useSpring(scrollIndexRaw, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  });

  // Sync scroll progress with currentIndex when scrollDriven is active
  useEffect(() => {
    if (!scrollDriven || shouldReduceMotion) return;
    const unsubscribe = smoothScrollIndex.on('change', (latest) => {
      if (!isDragging) {
        setCurrentIndex(latest);
      }
    });
    return () => unsubscribe();
  }, [smoothScrollIndex, scrollDriven, isDragging, shouldReduceMotion]);

  // Autoplay drift or step behavior (pauses when user hovers or drags)
  useEffect(() => {
    if (autoplay === 'off' || isHovered || isDragging || scrollDriven || shouldReduceMotion) return;

    let rafId: number;
    let lastTime = performance.now();

    if (autoplay === 'drift') {
      const stepDrift = (time: number) => {
        const delta = (time - lastTime) / 1000;
        lastTime = time;
        setCurrentIndex((prev) => {
          const next = prev + speed * delta;
          if (next >= items.length) return 0;
          if (next < 0) return items.length - 1;
          return next;
        });
        rafId = requestAnimationFrame(stepDrift);
      };
      rafId = requestAnimationFrame(stepDrift);
    } else if (autoplay === 'step') {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (Math.round(prev) + 1) % items.length);
      }, interval * 1000);
      return () => clearInterval(timer);
    }

    return () => cancelAnimationFrame(rafId);
  }, [autoplay, speed, interval, isHovered, isDragging, scrollDriven, shouldReduceMotion, items.length]);

  // Touch and mouse drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartIndex(currentIndex);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    // Map pixels dragged to card indices (approx 360px per card)
    const cardPx = viewportWidth < 640 ? 280 : 360;
    const newIndex = dragStartIndex - deltaX / cardPx;
    setCurrentIndex(Math.max(-0.5, Math.min(items.length - 0.5, newIndex)));
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Snap to nearest integer on release
    setCurrentIndex((prev) => Math.round(prev));
  };

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(items.length - 1, Math.round(prev) + 1));
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, Math.round(prev) - 1));
  }, []);

  // Panel sizing & responsive geometry
  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;
  const panelWidth = isMobile ? 280 : isTablet ? 320 : 360;
  const panelHeight = isMobile ? 420 : 470;

  // Curvature & cylindrical geometry
  // Cylinder radius R: larger radius creates a gentler curve; smaller radius bends tighter
  const baseRadius = isMobile ? 650 : isTablet ? 850 : 1050;
  const radiusCylinder = baseRadius / Math.max(0.2, curvature);
  const angleStepDeg = (panelWidth + gap) / (radiusCylinder * (Math.PI / 180));

  // Perspective calculation
  const perspectivePx = distance * panelHeight;

  return (
    <div
      ref={containerRef}
      className={`relative w-full select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Stage Viewport */}
      <div
        className="relative w-full overflow-hidden py-10 sm:py-16 flex flex-col items-center justify-center"
        style={{
          perspective: `${perspectivePx}px`,
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Curved 3D Gallery Stage */}
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
            transition: isDragging ? 'none' : 'transform 0.25s ease-out',
          }}
        >
          {items.map((item, index) => {
            const delta = index - currentIndex;
            // Angle around the cylinder in degrees
            const angleDeg = delta * angleStepDeg;
            const angleRad = angleDeg * (Math.PI / 180);

            // Inward-curving concave cylinder coordinates:
            // Center is at X = 0, Z = 0.
            // As angle moves away from 0, X spreads along the sine curve,
            // and Z recedes backwards along (cos(angle) - 1), while rotateY faces inward to the viewer.
            const x = radiusCylinder * Math.sin(angleRad);
            const z = radiusCylinder * (Math.cos(angleRad) - 1);
            const rotateY = -angleDeg;

            // Visual dimming & scaling
            const absDelta = Math.abs(delta);
            const cardScale = Math.max(0.78, 1 - absDelta * 0.06);
            const cardOpacity = Math.max(0.2, 1 - Math.min(1, absDelta * dim * 0.8));
            const cardBrightness = Math.max(0.6, 1 - Math.min(0.4, absDelta * 0.15));
            const zIndex = Math.round(100 - absDelta * 10);

            // Hide cards that curve beyond visual perimeter
            if (absDelta > 3.8) return null;

            return (
              <div
                key={item.id}
                onClick={(e) => {
                  if (Math.abs(delta) > 0.4) {
                    e.preventDefault();
                    setCurrentIndex(index);
                  }
                }}
                className="absolute inset-0 flex flex-col group will-change-transform"
                style={{
                  width: `${panelWidth}px`,
                  height: `${panelHeight}px`,
                  transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) scale(${cardScale})`,
                  opacity: cardOpacity,
                  filter: `brightness(${cardBrightness})`,
                  zIndex,
                  transformStyle: 'preserve-3d',
                  transition: isDragging
                    ? 'none'
                    : 'transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.3s ease-out, filter 0.3s ease-out',
                }}
              >
                {/* Main 3D Card Body */}
                <div
                  className="relative w-full h-full rounded-2xl sm:rounded-3xl bg-white border border-brand-border/90 shadow-card hover:shadow-card-hover overflow-hidden flex flex-col transition-all duration-300"
                  style={{
                    borderRadius: `${radius}px`,
                  }}
                >
                  {/* Top 3D Showcase Image with Brand Stamp */}
                  <div className="relative w-full h-48 sm:h-52 bg-gradient-to-br from-brand-bg-alt to-brand-blue-light/30 overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 select-none pointer-events-none"
                    />

                    {/* Subtle Gradient Overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

                    {/* USolve Official Watermark Badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-navy/85 backdrop-blur-md border border-white/20 shadow-sm text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                      <span className="text-[10px] font-bold tracking-wide font-heading">USolve 3D</span>
                    </div>

                    {/* Category / Capability Pill */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-brand-navy border border-brand-border/80 shadow-xs uppercase tracking-wider">
                        {item.badge}
                      </span>
                    </div>

                    {/* Card Title overlaid on bottom of image for sleek contrast */}
                    <div className="absolute bottom-3 left-3 right-3 z-10">
                      <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight drop-shadow-md line-clamp-1">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content & Features */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <p className="text-xs sm:text-sm text-brand-slate line-clamp-2 leading-relaxed mb-3">
                        {item.description}
                      </p>

                      {/* Feature Pills */}
                      {item.features && item.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {item.features.slice(0, 2).map((feat, fIdx) => (
                            <span
                              key={fIdx}
                              className="text-[10px] font-semibold text-brand-navy bg-brand-bg-alt px-2 py-0.5 rounded border border-brand-border/70"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* CTA Link to dedicated service section */}
                    <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between">
                      <Link
                        to={item.link}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-hover transition-colors group-hover:translate-x-0.5 duration-150"
                      >
                        <span>Explore Capabilities</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>

                      <span className="text-[11px] font-mono text-brand-slate/60 font-medium">
                        0{index + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* React Bits Pro Floor Reflection Effect */}
                {reflection > 0 && (
                  <div
                    aria-hidden="true"
                    className="absolute top-full left-0 right-0 overflow-hidden pointer-events-none select-none"
                    style={{
                      height: `${panelHeight * 0.35}px`,
                      transform: 'scaleY(-1) translateY(-4px)',
                      opacity: reflection * (1 - absDelta * 0.2),
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
                      filter: 'blur(1.5px)',
                    }}
                  >
                    <div
                      className="w-full h-full rounded-2xl bg-white border border-brand-border/40 overflow-hidden flex flex-col opacity-60"
                      style={{ borderRadius: `${radius}px` }}
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-36 object-cover object-center"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Interactive Navigation Controls */}
        <div className="relative z-20 mt-12 sm:mt-16 flex items-center justify-center gap-4 sm:gap-6">
          {/* Previous Button */}
          <button
            type="button"
            onClick={goToPrev}
            disabled={currentIndex <= 0.1}
            aria-label="Previous service"
            className="w-10 h-10 rounded-full bg-white border border-brand-border shadow-sm hover:shadow-md flex items-center justify-center text-brand-navy hover:text-brand-blue hover:border-brand-blue/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Pagination Indicators / Navigation Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {items.map((_, dotIdx) => {
              const isActive = Math.round(currentIndex) === dotIdx;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentIndex(dotIdx)}
                  aria-label={`Jump to service ${dotIdx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-7 sm:w-8 bg-brand-blue shadow-xs'
                      : 'w-2 bg-brand-border hover:bg-brand-slate/40'
                  }`}
                />
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={goToNext}
            disabled={currentIndex >= items.length - 1.1}
            aria-label="Next service"
            className="w-10 h-10 rounded-full bg-white border border-brand-border shadow-sm hover:shadow-md flex items-center justify-center text-brand-navy hover:text-brand-blue hover:border-brand-blue/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Instruction Hint Pill */}
        <div className="mt-4 text-center">
          <p className="text-[11px] font-medium text-brand-slate/70 tracking-wide inline-flex items-center gap-1.5 bg-brand-bg-alt/80 px-3 py-1 rounded-full border border-brand-border/60">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
            <span>Scroll or drag horizontally to rotate curved gallery</span>
          </p>
        </div>
      </div>
    </div>
  );
};
