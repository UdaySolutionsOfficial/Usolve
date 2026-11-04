import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  CheckCircle2,
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
import { Button } from './Button';

export interface ConcaveCarouselItem {
  id: string;
  title: string;
  shortTitle?: string;
  subtitle: string;
  badge: string;
  category?: string;
  image: string;
  link: string;
  summary?: string;
  highlights?: string[];
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

interface ThematicSatellite {
  basePos: string;
  hoverTransform: string;
  delay: string;
  icon: React.ReactNode;
}

// Service-specific floating vector icon satellites that pop out into open air around the card on hover
const getThematicSatellites = (id: string): ThematicSatellite[] => {
  switch (id) {
    case 'web-design-dev':
      return [
        {
          basePos: '-top-2 -right-2',
          hoverTransform:
            'group-hover:-translate-y-7 group-hover:translate-x-7 sm:group-hover:-translate-y-8 sm:group-hover:translate-x-8',
          delay: 'duration-300',
          icon: <Code2 className="w-4 h-4 text-brand-cyan" />,
        },
        {
          basePos: '-top-2 -left-2',
          hoverTransform:
            'group-hover:-translate-y-7 group-hover:-translate-x-7 sm:group-hover:-translate-y-8 sm:group-hover:-translate-x-8',
          delay: 'duration-300 delay-75',
          icon: <Globe className="w-4 h-4 text-brand-blue-light" />,
        },
        {
          basePos: 'bottom-5 -right-2',
          hoverTransform:
            'group-hover:translate-y-6 group-hover:translate-x-7 sm:group-hover:translate-y-7 sm:group-hover:translate-x-8',
          delay: 'duration-300 delay-100',
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />,
        },
      ];
    case 'custom-software':
      return [
        {
          basePos: '-top-2 -right-2',
          hoverTransform:
            'group-hover:-translate-y-7 group-hover:translate-x-7 sm:group-hover:-translate-y-8 sm:group-hover:translate-x-8',
          delay: 'duration-300',
          icon: <Cpu className="w-4 h-4 text-brand-cyan" />,
        },
        {
          basePos: '-top-2 -left-2',
          hoverTransform:
            'group-hover:-translate-y-7 group-hover:-translate-x-7 sm:group-hover:-translate-y-8 sm:group-hover:-translate-x-8',
          delay: 'duration-300 delay-75',
          icon: <Layers className="w-4 h-4 text-brand-blue-light" />,
        },
        {
          basePos: 'bottom-5 -right-2',
          hoverTransform:
            'group-hover:translate-y-6 group-hover:translate-x-7 sm:group-hover:translate-y-7 sm:group-hover:translate-x-8',
          delay: 'duration-300 delay-100',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
        },
      ];
    case 'mobile-app-development':
      return [
        {
          basePos: '-top-2 -right-2',
          hoverTransform:
            'group-hover:-translate-y-7 group-hover:translate-x-7 sm:group-hover:-translate-y-8 sm:group-hover:translate-x-8',
          delay: 'duration-300',
          icon: <Smartphone className="w-4 h-4 text-brand-cyan" />,
        },
        {
          basePos: '-top-2 -left-2',
          hoverTransform:
            'group-hover:-translate-y-7 group-hover:-translate-x-7 sm:group-hover:-translate-y-8 sm:group-hover:-translate-x-8',
          delay: 'duration-300 delay-75',
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />,
        },
        {
          basePos: 'bottom-5 -right-2',
          hoverTransform:
            'group-hover:translate-y-6 group-hover:translate-x-7 sm:group-hover:translate-y-7 sm:group-hover:translate-x-8',
          delay: 'duration-300 delay-100',
          icon: <Globe className="w-4 h-4 text-brand-blue-light" />,
        },
      ];
    case 'digital-marketing':
      return [
        {
          basePos: '-top-2 -right-2',
          hoverTransform:
            'group-hover:-translate-y-7 group-hover:translate-x-7 sm:group-hover:-translate-y-8 sm:group-hover:translate-x-8',
          delay: 'duration-300',
          icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
        },
        {
          basePos: '-top-2 -left-2',
          hoverTransform:
            'group-hover:-translate-y-7 group-hover:-translate-x-7 sm:group-hover:-translate-y-8 sm:group-hover:-translate-x-8',
          delay: 'duration-300 delay-75',
          icon: <Search className="w-4 h-4 text-brand-cyan" />,
        },
        {
          basePos: 'bottom-5 -right-2',
          hoverTransform:
            'group-hover:translate-y-6 group-hover:translate-x-7 sm:group-hover:translate-y-7 sm:group-hover:translate-x-8',
          delay: 'duration-300 delay-100',
          icon: <Sparkles className="w-3.5 h-3.5 text-brand-blue-light" />,
        },
      ];
    case 'seo-growth':
      return [
        {
          basePos: '-top-2 -right-2',
          hoverTransform:
            'group-hover:-translate-y-7 group-hover:translate-x-7 sm:group-hover:-translate-y-8 sm:group-hover:translate-x-8',
          delay: 'duration-300',
          icon: <Search className="w-4 h-4 text-amber-300" />,
        },
        {
          basePos: '-top-2 -left-2',
          hoverTransform:
            'group-hover:-translate-y-7 group-hover:-translate-x-7 sm:group-hover:-translate-y-8 sm:group-hover:-translate-x-8',
          delay: 'duration-300 delay-75',
          icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
        },
        {
          basePos: 'bottom-5 -right-2',
          hoverTransform:
            'group-hover:translate-y-6 group-hover:translate-x-7 sm:group-hover:translate-y-7 sm:group-hover:translate-x-8',
          delay: 'duration-300 delay-100',
          icon: <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />,
        },
      ];
    case 'ai-business-systems':
      return [
        {
          basePos: '-top-2 -right-2',
          hoverTransform:
            'group-hover:-translate-y-7 group-hover:translate-x-7 sm:group-hover:-translate-y-8 sm:group-hover:translate-x-8',
          delay: 'duration-300',
          icon: <Bot className="w-4 h-4 text-brand-cyan" />,
        },
        {
          basePos: '-top-2 -left-2',
          hoverTransform:
            'group-hover:-translate-y-7 group-hover:-translate-x-7 sm:group-hover:-translate-y-8 sm:group-hover:-translate-x-8',
          delay: 'duration-300 delay-75',
          icon: <Cpu className="w-4 h-4 text-purple-400" />,
        },
        {
          basePos: 'bottom-5 -right-2',
          hoverTransform:
            'group-hover:translate-y-6 group-hover:translate-x-7 sm:group-hover:translate-y-7 sm:group-hover:translate-x-8',
          delay: 'duration-300 delay-100',
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />,
        },
      ];
    case 'ecommerce-solutions':
      return [
        {
          basePos: '-top-2 -right-2',
          hoverTransform:
            'group-hover:-translate-y-7 group-hover:translate-x-7 sm:group-hover:-translate-y-8 sm:group-hover:translate-x-8',
          delay: 'duration-300',
          icon: <ShoppingBag className="w-4 h-4 text-emerald-400" />,
        },
        {
          basePos: '-top-2 -left-2',
          hoverTransform:
            'group-hover:-translate-y-7 group-hover:-translate-x-7 sm:group-hover:-translate-y-8 sm:group-hover:-translate-x-8',
          delay: 'duration-300 delay-75',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />,
        },
        {
          basePos: 'bottom-5 -right-2',
          hoverTransform:
            'group-hover:translate-y-6 group-hover:translate-x-7 sm:group-hover:translate-y-7 sm:group-hover:translate-x-8',
          delay: 'duration-300 delay-100',
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />,
        },
      ];
    case 'graphic-branding':
      return [
        {
          basePos: '-top-2 -right-2',
          hoverTransform:
            'group-hover:-translate-y-7 group-hover:translate-x-7 sm:group-hover:-translate-y-8 sm:group-hover:translate-x-8',
          delay: 'duration-300',
          icon: <Palette className="w-4 h-4 text-purple-400" />,
        },
        {
          basePos: '-top-2 -left-2',
          hoverTransform:
            'group-hover:-translate-y-7 group-hover:-translate-x-7 sm:group-hover:-translate-y-8 sm:group-hover:-translate-x-8',
          delay: 'duration-300 delay-75',
          icon: <Layers className="w-4 h-4 text-brand-blue-light" />,
        },
        {
          basePos: 'bottom-5 -right-2',
          hoverTransform:
            'group-hover:translate-y-6 group-hover:translate-x-7 sm:group-hover:translate-y-7 sm:group-hover:translate-x-8',
          delay: 'duration-300 delay-100',
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />,
        },
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

  // CALIBRATED CARD HEIGHT & ASPECT RATIO:
  // Balances full 3D visual visibility with generous breathing room below the section title
  let panelHeight: number;
  if (viewportHeight < 640) {
    panelHeight = 225;
  } else if (viewportHeight < 740) {
    panelHeight = 260;
  } else if (viewportHeight < 880) {
    panelHeight = 290;
  } else if (viewportHeight < 1050) {
    panelHeight = 320;
  } else {
    panelHeight = 355;
  }

  // Mobile width constraint
  if (viewportWidth < 500) {
    panelHeight = Math.min(panelHeight, Math.round((viewportWidth - 48) / 1.18));
  }

  const aspect = 1.18;
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
  const dragDistanceRef = useRef(0);

  // Active Modal Item for interactive service overview popup
  const [activeModalItem, setActiveModalItem] = useState<ConcaveCarouselItem | null>(null);

  // Smooth Arrow Transition & Snap Animation
  const targetIndexRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

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

  // Close modal on Escape key and automatically close when user scrolls to another section
  useEffect(() => {
    if (!activeModalItem) return;

    const initialScrollY = window.scrollY;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalItem(null);
      }
    };

    const handleWindowScroll = () => {
      // Professional UX rule: if user scrolls more than 12px, automatically close popup so the website flows smoothly
      if (Math.abs(window.scrollY - initialScrollY) > 12) {
        setActiveModalItem(null);
      }
    };

    const handleWindowWheel = (e: WheelEvent) => {
      // If user uses scroll wheel to navigate, smoothly dismiss popup
      if (Math.abs(e.deltaY) > 20 || Math.abs(e.deltaX) > 20) {
        setActiveModalItem(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    window.addEventListener('wheel', handleWindowWheel, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleWindowScroll);
      window.removeEventListener('wheel', handleWindowWheel);
    };
  }, [activeModalItem]);

  // Clean up animation frames on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Detect when user is actively scrolling page vertically
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
      if (!isDraggingRef.current && animFrameRef.current === null) {
        setCurrentIndex(val + manualOffset + autoDriftRef.current);
      }
    });
    return () => unsub();
  }, [smoothScrollIndex, manualOffset, shouldReduceMotion]);

  // HORIZONTAL SCROLL LISTENER (Trackpad 2-finger horizontal swipe & horizontal wheel)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let wheelTimeout: number | null = null;

    const handleWheel = (e: WheelEvent) => {
      if (activeModalItem) return;

      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);

      // If user is intentionally scrolling horizontally (|deltaX| > |deltaY|)
      if (absX > absY && absX > 1.5) {
        // Prevent default browser back/forward history navigation gesture
        e.preventDefault();

        // Pause ambient drift while scrolling
        isScrollingRef.current = true;
        if (wheelTimeout !== null) {
          window.clearTimeout(wheelTimeout);
        }
        wheelTimeout = window.setTimeout(() => {
          isScrollingRef.current = false;
        }, 220);

        // Cancel any button animation in progress
        if (animFrameRef.current !== null) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
          targetIndexRef.current = null;
        }

        const pxPerCard = panelWidth + gap;
        const deltaFraction = (e.deltaX / pxPerCard) * 0.95;

        setCurrentIndex((prev) => {
          const next = prev + deltaFraction;
          const scrollVal = smoothScrollIndex.get();
          autoDriftRef.current = 0;
          setManualOffset(next - scrollVal);
          return next;
        });
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (wheelTimeout !== null) {
        window.clearTimeout(wheelTimeout);
      }
    };
  }, [panelWidth, gap, smoothScrollIndex, activeModalItem]);

  // NATURAL AUTOMATIC SMOOTH MOVING LOOP (Ambient Drift when Idle)
  useEffect(() => {
    if (!autoplay || shouldReduceMotion) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (
        !isDraggingRef.current &&
        !isHoveredRef.current &&
        !isScrollingRef.current &&
        animFrameRef.current === null &&
        !activeModalItem
      ) {
        autoDriftRef.current += speed * dt;
        const baseScroll = smoothScrollIndex.get();
        setCurrentIndex(baseScroll + manualOffset + autoDriftRef.current);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [autoplay, speed, manualOffset, smoothScrollIndex, shouldReduceMotion, activeModalItem]);

  // Silky-smooth eased transition to any target index
  const smoothTransitionTo = useCallback(
    (targetVal: number) => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }

      targetIndexRef.current = targetVal;
      const startVal = currentIndex;
      const totalChange = targetVal - startVal;
      const startTime = performance.now();
      const duration = 440; // 440ms: silky-smooth fluid easing

      isScrollingRef.current = true;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Silky cubic ease-out: starts with gentle momentum, settles like silk
        const ease = 1 - Math.pow(1 - progress, 3);
        const nextIdx = startVal + totalChange * ease;

        setCurrentIndex(nextIdx);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          setCurrentIndex(targetVal);
          const scrollVal = smoothScrollIndex.get();
          autoDriftRef.current = 0;
          setManualOffset(targetVal - scrollVal);
          targetIndexRef.current = null;
          animFrameRef.current = null;
          isScrollingRef.current = false;
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    },
    [currentIndex, smoothScrollIndex]
  );

  // Pointer drag gestures
  const handlePointerDown = (e: React.PointerEvent) => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
      targetIndexRef.current = null;
    }
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartCurrentRef.current = currentIndex;
    dragDistanceRef.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    dragDistanceRef.current = Math.abs(deltaX);
    const pxPerCard = panelWidth + gap;
    const newIdx = dragStartCurrentRef.current - deltaX / pxPerCard;
    setCurrentIndex(newIdx);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    setIsDragging(false);
    isDraggingRef.current = false;
    const target = Math.round(currentIndex);
    smoothTransitionTo(target);
    setTimeout(() => {
      dragDistanceRef.current = 0;
    }, 60);
  };

  // Arrow button clicks: smoothly glides cards forward or backward
  const goToNext = useCallback(() => {
    const currentBase =
      targetIndexRef.current !== null ? targetIndexRef.current : currentIndex;
    const nextTarget = Math.round(currentBase) + 1;
    smoothTransitionTo(nextTarget);
  }, [currentIndex, smoothTransitionTo]);

  const goToPrev = useCallback(() => {
    const currentBase =
      targetIndexRef.current !== null ? targetIndexRef.current : currentIndex;
    const prevTarget = Math.round(currentBase) - 1;
    smoothTransitionTo(prevTarget);
  }, [currentIndex, smoothTransitionTo]);

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
      {hoveredCard && !activeModalItem && (
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
            <span className="text-[10px] text-brand-cyan font-semibold ml-1">✦ Quick View</span>
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
                {/* Interactive Satellite Vector Icons: pop out into open air around the card on hover */}
                {getThematicSatellites(item.id).map((sat, sIdx) => (
                  <div
                    key={sIdx}
                    aria-hidden="true"
                    className={`absolute ${sat.basePos} pointer-events-none z-30 transform transition-all ease-out scale-50 opacity-0 ${sat.hoverTransform} group-hover:scale-100 group-hover:opacity-100 ${sat.delay}`}
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-navy/95 border border-brand-cyan/40 shadow-xl shadow-brand-blue/30 backdrop-blur-md flex items-center justify-center text-white">
                      {sat.icon}
                    </div>
                  </div>
                ))}

                {/* 3D Depth Card: Interactive Click opens Quick View popup (or smoothly centers side card) */}
                <div
                  role="button"
                  tabIndex={0}
                  onMouseEnter={() => setHoveredCard(item)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    // If user was dragging, don't trigger click action
                    if (dragDistanceRef.current > 8) return;

                    if (absDelta > 0.4) {
                      // Smoothly glide side card to center
                      const target = Math.round(currentIndex + delta);
                      smoothTransitionTo(target);
                    } else {
                      // Center card clicked: open the interactive service popup!
                      setActiveModalItem(item);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveModalItem(item);
                    }
                  }}
                  className="relative w-full h-full block rounded-[18px] sm:rounded-[22px] overflow-hidden shadow-2xl transition-all duration-300 group-hover:scale-[1.025] group-hover:shadow-brand-blue/20 border border-white/20 bg-white z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
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

                  {/* Subtle Bottom Gradient Scrim for Bottom-Left Info Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Minimalist Micro Tag in Bottom-Left Corner */}
                  <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 z-10 pointer-events-none select-none text-left">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-black/55 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-semibold text-white/90 tracking-wide shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                      <span>{item.shortTitle || item.title}</span>
                    </span>
                  </div>
                </div>

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

      {/* Service Detail Interactive 3D Card Expansion Popup Modal */}
      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 pointer-events-auto">
            {/* Ambient Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={() => setActiveModalItem(null)}
              className="fixed inset-0 bg-brand-navy/65 backdrop-blur-md cursor-pointer"
              aria-hidden="true"
            />

            {/* 3D Motion Graphics Expanded Card: Physically moves forward from 3D space & reveals details */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 30, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.78, y: 20, rotateX: 8 }}
              transition={{
                type: 'spring',
                damping: 26,
                stiffness: 280,
                mass: 0.8,
              }}
              style={{
                transformPerspective: 1200,
                transformStyle: 'preserve-3d',
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-modal-title"
              className="relative w-full max-w-[520px] max-h-[85vh] sm:max-h-[80vh] bg-white rounded-[22px] sm:rounded-[26px] shadow-[0_30px_90px_-15px_rgba(15,35,70,0.45)] border border-white/60 overflow-hidden z-10 flex flex-col text-left my-auto"
            >
              {/* Image Banner Header: Seamless continuation of the 3D card artwork */}
              <div className="relative h-40 sm:h-48 w-full shrink-0 overflow-hidden bg-brand-navy select-none">
                <img
                  src={activeModalItem.image}
                  alt={activeModalItem.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-black/30" />

                {/* Top Header: Badge & Close Button */}
                <div className="absolute top-3 left-3.5 right-3.5 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-navy/90 text-white backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-semibold shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                    <span>{activeModalItem.category || activeModalItem.badge}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setActiveModalItem(null)}
                    aria-label="Close modal"
                    className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer border border-white/20 hover:scale-105 active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Service Title & Subtitle pinned to banner bottom */}
                <div className="absolute bottom-3 left-4 right-4 z-10">
                  <h3
                    id="service-modal-title"
                    className="text-lg sm:text-xl font-extrabold text-white tracking-tight drop-shadow-md font-heading"
                  >
                    {activeModalItem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-blue-light font-medium line-clamp-1 mt-0.5">
                    {activeModalItem.subtitle}
                  </p>
                </div>
              </div>

              {/* Modal Body (Scrollable if height constrained on smaller screens) */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
                {/* Client-friendly plain explanation */}
                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                  {activeModalItem.summary || activeModalItem.subtitle}
                </p>

                {/* Key Business Advantages */}
                {activeModalItem.highlights && activeModalItem.highlights.length > 0 && (
                  <div className="pt-0.5">
                    <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-navy/70 mb-2">
                      Key Business Advantages
                    </h4>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {activeModalItem.highlights.map((highlight, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2 text-xs sm:text-sm text-brand-navy">
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Action Bar */}
              <div className="p-3.5 sm:p-4 bg-brand-bg-alt/40 border-t border-brand-border/60 shrink-0 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-brand-slate hover:text-brand-navy hover:bg-brand-bg-alt transition-colors cursor-pointer"
                >
                  Close
                </button>

                <Button
                  to={activeModalItem.link}
                  variant="primary"
                  size="sm"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => setActiveModalItem(null)}
                  className="shadow-sm hover:shadow text-xs py-2 px-4"
                >
                  Explore Full Service Details
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
