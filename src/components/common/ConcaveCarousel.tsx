import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Code2,
  Layers,
  Smartphone,
  TrendingUp,
  Search,
  Bot,
  ShoppingBag,
  Palette,
  Sparkles,
  Cpu,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ConcaveCarouselItem {
  id: string;
  title: string;
  shortTitle?: string;
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
  autoplay?: boolean; // gentle automatic smooth drift when idle
  speed?: number; // drift speed in panels per second
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

interface FloatingThematicBadge {
  label: string;
  pos: string;
  icon: React.ReactNode;
}

// Service-specific floating interactive badges on hover
const getThematicFloatingElements = (id: string): FloatingThematicBadge[] => {
  switch (id) {
    case 'web-design-dev':
      return [
        { label: 'Clean Code', pos: 'top-3 right-3', icon: <Code2 className="w-3 h-3 text-brand-blue-light" /> },
        { label: 'React + TS', pos: 'top-3 left-3', icon: <Globe className="w-3 h-3 text-brand-cyan" /> },
        { label: '99+ Speed', pos: 'bottom-14 right-3', icon: <Sparkles className="w-3 h-3 text-emerald-400" /> },
      ];
    case 'custom-software':
      return [
        { label: 'Cloud APIs', pos: 'top-3 right-3', icon: <Layers className="w-3 h-3 text-brand-blue-light" /> },
        { label: 'Microservices', pos: 'top-3 left-3', icon: <Cpu className="w-3 h-3 text-brand-cyan" /> },
        { label: '99.9% Uptime', pos: 'bottom-14 right-3', icon: <ShieldCheck className="w-3 h-3 text-emerald-400" /> },
      ];
    case 'mobile-app-development':
      return [
        { label: 'iOS & Android', pos: 'top-3 right-3', icon: <Smartphone className="w-3 h-3 text-brand-blue-light" /> },
        { label: 'Native 60fps', pos: 'top-3 left-3', icon: <Sparkles className="w-3 h-3 text-amber-400" /> },
        { label: 'Fluid UX', pos: 'bottom-14 right-3', icon: <Globe className="w-3 h-3 text-brand-cyan" /> },
      ];
    case 'digital-marketing':
      return [
        { label: 'Meta & Ads', pos: 'top-3 right-3', icon: <TrendingUp className="w-3 h-3 text-brand-blue-light" /> },
        { label: '+350% ROI', pos: 'top-3 left-3', icon: <Sparkles className="w-3 h-3 text-emerald-400" /> },
        { label: 'High CTR', pos: 'bottom-14 right-3', icon: <Search className="w-3 h-3 text-amber-400" /> },
      ];
    case 'seo-growth':
      return [
        { label: '#1 Google Rank', pos: 'top-3 right-3', icon: <Search className="w-3 h-3 text-amber-400" /> },
        { label: '+240% Traffic', pos: 'top-3 left-3', icon: <TrendingUp className="w-3 h-3 text-emerald-400" /> },
        { label: 'Core Vitals', pos: 'bottom-14 right-3', icon: <Sparkles className="w-3 h-3 text-brand-cyan" /> },
      ];
    case 'ai-business-systems':
      return [
        { label: 'Neural AI', pos: 'top-3 right-3', icon: <Bot className="w-3 h-3 text-brand-cyan" /> },
        { label: 'Voice Agents', pos: 'top-3 left-3', icon: <Cpu className="w-3 h-3 text-purple-400" /> },
        { label: 'Automation', pos: 'bottom-14 right-3', icon: <Sparkles className="w-3 h-3 text-amber-400" /> },
      ];
    case 'ecommerce-solutions':
      return [
        { label: 'Smart Storefront', pos: 'top-3 right-3', icon: <ShoppingBag className="w-3 h-3 text-emerald-400" /> },
        { label: 'Fast Checkout', pos: 'top-3 left-3', icon: <ShieldCheck className="w-3 h-3 text-brand-cyan" /> },
        { label: 'Instant Pay', pos: 'bottom-14 right-3', icon: <Sparkles className="w-3 h-3 text-amber-400" /> },
      ];
    case 'graphic-branding':
      return [
        { label: 'Design Systems', pos: 'top-3 right-3', icon: <Palette className="w-3 h-3 text-purple-400" /> },
        { label: 'Vector Precision', pos: 'top-3 left-3', icon: <Layers className="w-3 h-3 text-brand-blue-light" /> },
        { label: 'Pantone Palette', pos: 'bottom-14 right-3', icon: <Sparkles className="w-3 h-3 text-amber-400" /> },
      ];
    default:
      return [];
  }
};

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
  speed = 0.1, // Smooth, elegant ambient movement: ~10s per card transition
  scrollTargetRef,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const totalItems = items.length;

  // Viewport dimensions
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

  // SUBSTANTIALLY INCREASED CARD HEIGHT:
  // Taller aspect ratio (~1.12) ensures images are fully visible with zero cropping
  let panelHeight: number;
  if (viewportHeight < 640) {
    panelHeight = 260;
  } else if (viewportHeight < 740) {
    panelHeight = 310;
  } else if (viewportHeight < 880) {
    panelHeight = 350;
  } else if (viewportHeight < 1050) {
    panelHeight = 385;
  } else {
    panelHeight = 420;
  }

  // Mobile width constraint
  if (viewportWidth < 500) {
    panelHeight = Math.min(panelHeight, Math.round((viewportWidth - 48) / 1.12));
  }

  const aspect = 1.12;
  const panelWidth = Math.round(panelHeight * aspect);

  // SCROLL-DRIVEN BIDIRECTIONAL CONTROL
  const targetRef = scrollTargetRef || containerRef;
  const { scrollYProgress } = useScroll({
    target: targetRef as React.RefObject<HTMLElement>,
    offset: ['start start', 'end end'],
  });

  const scrollIndex = useTransform(scrollYProgress, [0, 1], [0, totalItems - 1]);

  // Interaction & drift tracking
  const [manualOffset, setManualOffset] = useState<number>(startIndex);
  const autoDriftRef = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartCurrentRef = useRef(0);

  // Custom Cursor Pill Tracking State
  const [hoveredCard, setHoveredCard] = useState<ConcaveCarouselItem | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });

  // Active continuous index
  const [currentIndex, setCurrentIndex] = useState<number>(startIndex);

  // Smooth spring for scroll motion
  const smoothScrollIndex = useSpring(scrollIndex, {
    stiffness: 85,
    damping: 24,
    mass: 0.28,
  });

  // Track mouse coordinates for floating cursor pill
  const handleContainerPointerMove = (e: React.PointerEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Detect when user is actively scrolling page
  useEffect(() => {
    const handleScroll = () => {
      isScrollingRef.current = true;
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
      }, 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Sync scroll position with current index
  useEffect(() => {
    if (shouldReduceMotion) return;
    const unsub = smoothScrollIndex.on('change', (val) => {
      if (!isDraggingRef.current) {
        setCurrentIndex(val + manualOffset + autoDriftRef.current);
      }
    });
    return () => unsub();
  }, [smoothScrollIndex, manualOffset, shouldReduceMotion]);

  // NATURAL AUTOMATIC SMOOTH MOVING LOOP (Ambient Drift when Idle)
  useEffect(() => {
    if (!autoplay || shouldReduceMotion) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (!isDraggingRef.current && !isHoveredRef.current && !isScrollingRef.current) {
        autoDriftRef.current += speed * dt;
        const baseScroll = smoothScrollIndex.get();
        setCurrentIndex(baseScroll + manualOffset + autoDriftRef.current);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [autoplay, speed, manualOffset, smoothScrollIndex, shouldReduceMotion]);

  // Pointer drag gestures
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartCurrentRef.current = currentIndex;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const pxPerCard = panelWidth + gap;
    const newIdx = dragStartCurrentRef.current - deltaX / pxPerCard;
    setCurrentIndex(newIdx);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    setIsDragging(false);
    isDraggingRef.current = false;
    const target = Math.round(currentIndex);
    const scrollVal = smoothScrollIndex.get();
    autoDriftRef.current = 0;
    setManualOffset(target - scrollVal);
    setCurrentIndex(target);
  };

  // Arrow button clicks: smoothly moves cards forward or backward
  const goToNext = useCallback(() => {
    setManualOffset((prev) => prev + 1);
    setCurrentIndex((prev) => Math.round(prev) + 1);
  }, []);

  const goToPrev = useCallback(() => {
    setManualOffset((prev) => prev - 1);
    setCurrentIndex((prev) => Math.round(prev) - 1);
  }, []);

  // 3D Geometry calculations
  const stepAngleDeg = 28 * Math.max(0.65, curvature);
  const stepAngleRad = (stepAngleDeg * Math.PI) / 180;
  const cylinderRadius = Math.round(
    (panelWidth + gap) / (2 * Math.sin(stepAngleRad / 2 || 0.1))
  );
  const perspectivePx = Math.max(950, distance * panelHeight);

  // Active rounded index normalized to [0, totalItems - 1]
  const activeNormalizedIdx =
    ((Math.round(currentIndex) % totalItems) + totalItems) % totalItems;

  const navMarginTop = Math.round(panelHeight * 0.2 + 30);

  return (
    <div
      ref={containerRef}
      onPointerMove={handleContainerPointerMove}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        setHoveredCard(null);
      }}
      className={`relative w-full select-none ${className}`}
    >
      {/* Floating Custom Cursor Text Pill Following Mouse on Hover */}
      {hoveredCard && (
        <div
          aria-hidden="true"
          className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out will-change-transform hidden sm:block"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            transform: 'translate(-50%, -140%)',
          }}
        >
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-navy/95 text-white border border-brand-blue/50 shadow-2xl backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
            <span className="text-xs font-bold tracking-tight font-heading whitespace-nowrap">
              {hoveredCard.shortTitle || hoveredCard.title}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-brand-blue-light" />
          </div>
        </div>
      )}

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
            // Endless Loop Wrapping Math
            const normCurrent = ((currentIndex % totalItems) + totalItems) % totalItems;
            let delta = index - normCurrent;
            while (delta > totalItems / 2) delta -= totalItems;
            while (delta < -totalItems / 2) delta += totalItems;

            const absDelta = Math.abs(delta);

            if (absDelta > 3.2) return null;

            const angleDeg = delta * stepAngleDeg;
            const angleRad = (angleDeg * Math.PI) / 180;

            const x = cylinderRadius * Math.sin(angleRad);
            const z = cylinderRadius * (1 - Math.cos(angleRad)) * 0.6;
            const rotateY = -angleDeg;

            const scale = Math.max(0.82, 1.02 - absDelta * 0.055);
            const cardOpacity = Math.max(0, 1 - Math.pow(absDelta / 3.2, 2));
            const cardBrightness = Math.max(0.65, 1 - Math.min(0.35, absDelta * dim * 0.45));
            const zIndex = Math.round(60 - absDelta * 10);

            const captionOpacity = Math.max(0, 1 - absDelta * 2.5);

            return (
              <div
                key={item.id}
                onClick={(e) => {
                  if (absDelta > 0.4) {
                    e.preventDefault();
                    setManualOffset((prev) => prev + delta);
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
                {/* 3D Depth Card: 100% UNOBSTRUCTED CENTER ARTWORK */}
                <Link
                  to={item.link}
                  onMouseEnter={() => setHoveredCard(item)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="relative w-full h-full block rounded-[18px] sm:rounded-[22px] overflow-hidden shadow-2xl transition-all duration-300 group-hover:scale-[1.025] group-hover:shadow-brand-blue/20 border border-white/20 bg-white"
                  style={{
                    borderRadius: `${radius}px`,
                    boxShadow:
                      absDelta < 0.6
                        ? '0 28px 65px -15px rgba(20, 39, 68, 0.35), 0 12px 25px -6px rgba(20, 39, 68, 0.2)'
                        : '0 16px 36px -12px rgba(20, 39, 68, 0.22)',
                  }}
                >
                  {/* Full-bleed 3D Render Image - Center artwork 100% visible and unblocked */}
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gentle Bottom Gradient Scrim for Bottom-Left Info Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

                  {/* Floating Thematic Interactive Elements on Card Hover */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    {getThematicFloatingElements(item.id).map((elem, eIdx) => (
                      <div
                        key={eIdx}
                        className={`absolute ${elem.pos} px-2.5 py-1 rounded-full bg-brand-navy/90 border border-white/30 text-white shadow-xl backdrop-blur-md flex items-center gap-1.5 transition-all duration-500`}
                        style={{
                          transform: 'translateY(0px)',
                          animation: `bounce 2.5s ease-in-out infinite alternate ${eIdx * 0.3}s`,
                        }}
                      >
                        {elem.icon}
                        <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">
                          {elem.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Compact Bottom-Left Info Badge - Leaves Center 3D Artwork Pure & Visible */}
                  <div className="absolute bottom-3 left-3 sm:bottom-3.5 sm:left-3.5 z-10 pointer-events-none select-none text-left">
                    <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-brand-navy/85 backdrop-blur-md border border-white/20 shadow-md">
                      <span className="block text-xs sm:text-[13px] font-bold text-white tracking-tight font-heading leading-tight drop-shadow-xs">
                        {item.shortTitle || item.title}
                      </span>
                      {item.category && (
                        <span className="block text-[9px] sm:text-[10px] font-medium text-brand-blue-light/90 tracking-wider uppercase mt-0.5">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* React Bits Pro Floor Reflection Effect */}
                {reflection > 0 && (
                  <div
                    aria-hidden="true"
                    className="absolute top-full left-0 right-0 overflow-hidden pointer-events-none select-none mt-1 sm:mt-1.5"
                    style={{
                      height: `${Math.round(panelHeight * 0.2)}px`,
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

                {/* Caption Directly Under Card */}
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
