import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  distance?: number; // distance in panel heights, default 3.6
  tilt?: number; // vertical tilt in degrees, default 0
  gap?: number; // gap between panels in px, default 24
  radius?: number; // corner radius in px, default 20
  reflection?: number; // reflection opacity, default 0.14
  dim?: number; // edge dimming factor, default 0.35
  autoplay?: boolean; // natural automatic smooth moving loop
  speed?: number; // continuous drift speed (panels/sec)
  className?: string;
}

export const ConcaveCarousel: React.FC<ConcaveCarouselProps> = ({
  items,
  startIndex = 0,
  curvature = 0.72,
  distance = 3.6,
  tilt = 0,
  gap = 24,
  radius = 20,
  reflection = 0.14,
  dim = 0.35,
  autoplay = true,
  speed = 0.12, // Silky smooth natural drift: ~8s per card transition
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [currentIndex, setCurrentIndex] = useState<number>(startIndex);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartIndexRef = useRef(0);
  const lastScrollYRef = useRef(typeof window !== 'undefined' ? window.scrollY : 0);

  // Initialize with exact window dimensions
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800
  );

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalItems = items.length;

  // INCREASED HEIGHT & CARD SIZING:
  // Taller panel height with 1.26 aspect ratio ensures the 3D artwork inside
  // is 100% visible vertically with NO top/bottom cropping.
  let panelHeight: number;
  if (viewportHeight < 620) {
    panelHeight = 245;
  } else if (viewportHeight < 720) {
    panelHeight = 290;
  } else if (viewportHeight < 850) {
    panelHeight = 330;
  } else if (viewportHeight < 1050) {
    panelHeight = 365;
  } else {
    panelHeight = 400;
  }

  // Mobile constraint
  if (viewportWidth < 500) {
    panelHeight = Math.min(panelHeight, Math.round((viewportWidth - 48) / 1.26));
  }

  // 1.26 aspect ratio perfectly matches the 1200x896 source images vertically
  const aspect = 1.26;
  const panelWidth = Math.round(panelHeight * aspect);

  // NATURAL AUTOMATIC SMOOTH MOVING LOOP (Autoplay Drift)
  // Buttery smooth requestAnimationFrame loop that continuously drifts across cards
  useEffect(() => {
    if (!autoplay || shouldReduceMotion) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000); // capped delta time in seconds
      lastTime = now;

      if (!isDraggingRef.current && !isHoveredRef.current) {
        setCurrentIndex((prev) => prev + speed * dt);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [autoplay, speed, shouldReduceMotion]);

  // ON-SCROLL SYNC:
  // When the user scrolls vertically, the carousel smoothly advances with the scroll
  useEffect(() => {
    if (shouldReduceMotion) return;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollYRef.current;
      lastScrollYRef.current = currentY;

      // Only advance if there is scroll movement and not currently dragging
      if (Math.abs(deltaY) > 0.5 && !isDraggingRef.current) {
        setCurrentIndex((prev) => prev + deltaY * 0.0028);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldReduceMotion]);

  // Pointer drag gestures with infinite wrapping
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartIndexRef.current = currentIndex;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const pxPerCard = panelWidth + gap;
    const newIdx = dragStartIndexRef.current - deltaX / pxPerCard;
    setCurrentIndex(newIdx);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    setIsDragging(false);
    isDraggingRef.current = false;
    // Smoothly snap to nearest integer card
    setCurrentIndex((prev) => Math.round(prev));
  };

  // Button navigation with endless loop
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.round(prev) + 1);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.round(prev) - 1);
  }, []);

  // 3D Geometry calculations matching React Bits Pro Concave Carousel:
  const stepAngleDeg = 28 * Math.max(0.65, curvature);
  const stepAngleRad = (stepAngleDeg * Math.PI) / 180;
  // Circumradius for exact physical gap between adjacent curved panels
  const cylinderRadius = Math.round(
    (panelWidth + gap) / (2 * Math.sin(stepAngleRad / 2 || 0.1))
  );
  const perspectivePx = Math.max(950, distance * panelHeight);

  // Active rounded index normalized to [0, totalItems - 1]
  const activeNormalizedIdx =
    ((Math.round(currentIndex) % totalItems) + totalItems) % totalItems;

  // Clear height for navigation controls below floor reflection and caption
  const navMarginTop = Math.round(panelHeight * 0.22 + 34);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      className={`relative w-full select-none ${className}`}
    >
      {/* 3D Perspective Stage Viewport */}
      <div
        className="relative w-full flex flex-col items-center justify-center"
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
            transition: isDragging ? 'none' : 'transform 0.18s ease-out',
          }}
        >
          {items.map((item, index) => {
            // Endless Loop Wrapping Math (1-n-1 continuous cylinder):
            // Compute shortest circular offset on the N-card drum in range [-N/2, N/2)
            const normCurrent = ((currentIndex % totalItems) + totalItems) % totalItems;
            let delta = index - normCurrent;
            while (delta > totalItems / 2) delta -= totalItems;
            while (delta < -totalItems / 2) delta += totalItems;

            const absDelta = Math.abs(delta);

            // Hide cards on the far rear side (> 3.2 panels) to keep rendering smooth & clean
            if (absDelta > 3.2) return null;

            const angleDeg = delta * stepAngleDeg;
            const angleRad = (angleDeg * Math.PI) / 180;

            // Mathematical Concave Cylinder Transformation:
            // Center is at (0, 0, 0).
            // Side cards curve forward along the cylinder arc (Z > 0)
            // and turn their faces inward to the center (rotateY = -angleDeg)
            const x = cylinderRadius * Math.sin(angleRad);
            const z = cylinderRadius * (1 - Math.cos(angleRad)) * 0.6;
            const rotateY = -angleDeg;

            // Visual Depth, dimming, and edge fading matching reference video:
            // Center card is large (1.02), prominent, crisp, and elevated.
            const scale = Math.max(0.82, 1.02 - absDelta * 0.055);
            const cardOpacity = Math.max(0, 1 - Math.pow(absDelta / 3.2, 2));
            const cardBrightness = Math.max(0.65, 1 - Math.min(0.35, absDelta * dim * 0.45));
            // Keep center card strictly on top of overlapping side panels
            const zIndex = Math.round(60 - absDelta * 10);

            // Active caption visibility under active card (fades rapidly on side cards)
            const captionOpacity = Math.max(0, 1 - absDelta * 2.5);

            return (
              <div
                key={item.id}
                onClick={(e) => {
                  if (absDelta > 0.4) {
                    e.preventDefault();
                    setCurrentIndex((prev) => prev + delta);
                  }
                }}
                className="absolute inset-0 flex flex-col items-center group will-change-transform"
                style={{
                  width: `${panelWidth}px`,
                  height: `${panelHeight}px`,
                  transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity: cardOpacity,
                  filter: `brightness(${cardBrightness})`,
                  zIndex,
                  transformStyle: 'preserve-3d',
                  transition: isDragging
                    ? 'none'
                    : 'transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.22s ease-out, filter 0.22s ease-out',
                }}
              >
                {/* 3D Depth Card: 100% PURE, CLEAN FULL-BLEED ARTWORK (TALLER HEIGHT FOR FULL IMAGE VIEW) */}
                <Link
                  to={item.link}
                  className="relative w-full h-full block rounded-[18px] sm:rounded-[22px] overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-[1.02] border border-white/20 bg-white"
                  style={{
                    borderRadius: `${radius}px`,
                    boxShadow:
                      absDelta < 0.6
                        ? '0 28px 65px -15px rgba(20, 39, 68, 0.35), 0 12px 25px -6px rgba(20, 39, 68, 0.2)'
                        : '0 16px 36px -12px rgba(20, 39, 68, 0.22)',
                  }}
                >
                  {/* Full-bleed 3D Render Image - Tall, uncropped, 100% visible vertical view */}
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>

                {/* React Bits Pro Floor Reflection Effect */}
                {reflection > 0 && (
                  <div
                    aria-hidden="true"
                    className="absolute top-full left-0 right-0 overflow-hidden pointer-events-none select-none mt-1 sm:mt-1.5"
                    style={{
                      height: `${Math.round(panelHeight * 0.22)}px`,
                      transform: 'scaleY(-1)',
                      opacity: reflection * Math.max(0, 1 - absDelta * 0.25),
                      maskImage:
                        'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 80%)',
                      WebkitMaskImage:
                        'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 80%)',
                      filter: 'blur(1.5px)',
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
                  className="w-full text-center mt-3 sm:mt-4 select-none pointer-events-none transition-opacity duration-200"
                  style={{
                    opacity: captionOpacity,
                    transform: `translateY(${absDelta * 3}px)`,
                  }}
                >
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-brand-navy tracking-tight drop-shadow-xs line-clamp-1 px-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-slate mt-0.5 line-clamp-1 max-w-md mx-auto px-2">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Controls (< 01 / 08 >) Exact Style as Reference Video */}
        <div
          className="relative z-30 flex items-center justify-center gap-4 sm:gap-6"
          style={{ marginTop: `${navMarginTop}px` }}
        >
          {/* Previous Button */}
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous service"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-brand-border/90 shadow-sm hover:shadow hover:bg-brand-bg-alt flex items-center justify-center text-brand-navy hover:text-brand-blue transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Monospace Counter (e.g. 01 / 08) */}
          <div className="font-mono text-xs sm:text-sm font-semibold text-brand-slate tracking-widest px-2">
            <span className="text-brand-navy font-bold">
              {String(activeNormalizedIdx + 1).padStart(2, '0')}
            </span>
            <span className="mx-1.5 text-brand-slate/40">/</span>
            <span>{String(totalItems).padStart(2, '0')}</span>
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next service"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-brand-border/90 shadow-sm hover:shadow hover:bg-brand-bg-alt flex items-center justify-center text-brand-navy hover:text-brand-blue transition-all active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
