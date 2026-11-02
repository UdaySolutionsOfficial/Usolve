import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const HeroVideoSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(19);
  const [showControls, setShowControls] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const hasAutoPlayedWithSound = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  // Scroll to scale effect tracking:
  // Starts responding when the section enters the lower viewport and smoothly
  // expands to its full occupying presence as it aligns in view.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 92%', 'center 48%'],
  });

  // Sensitive "very small to big" scaling:
  // Starts at a compact 0.58 scale and expands dynamically to 1.0 (full occupying width)
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [0.58, 1.0]);
  const opacityRaw = useTransform(scrollYProgress, [0, 0.25], [0.75, 1.0]);

  // Spring physics calibrated for immediate sensitivity and fluid responsiveness without lag
  const scaleSpring = useSpring(scaleRaw, {
    stiffness: 220,
    damping: 26,
    mass: 0.25,
  });
  const opacitySpring = useSpring(opacityRaw, {
    stiffness: 220,
    damping: 26,
    mass: 0.25,
  });

  const animatedScale = shouldReduceMotion ? 1 : scaleSpring;
  const animatedOpacity = shouldReduceMotion ? 1 : opacitySpring;

  // Auto-play with sound on first scroll into view, and auto-mute when scrolling away
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    // Enforce initial muted state for strict browser load compliance
    video.muted = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            // First time user scrolls into the video section:
            // Attempt unmuted auto-play with audio
            if (!hasAutoPlayedWithSound.current) {
              hasAutoPlayedWithSound.current = true;
              video.muted = false;
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    setIsMuted(false);
                    setIsPlaying(true);
                    setHasInteracted(true);
                  })
                  .catch(() => {
                    // Browser policy blocked unmuted playback prior to user gesture;
                    // gracefully continue playing in muted mode without error
                    video.muted = true;
                    video.play().catch(() => {});
                    setIsMuted(true);
                    setIsPlaying(true);
                  });
              }
            } else {
              // Returning back to the video section: resume playback if paused
              if (video.paused) {
                video.play().then(() => setIsPlaying(true)).catch(() => {});
              }
            }
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
            // When user scrolls up/down toward next sections:
            // Automatically mute the video
            if (!video.muted) {
              video.muted = true;
              setIsMuted(true);
            }
          }
        });
      },
      { threshold: [0.15, 0.35, 0.6] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Track mouse coordinates for the custom cursor pill
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Update progress bar & time counters
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration || 19);
  };

  // Play / Pause toggle
  const togglePlay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  // Mute / Unmute toggle
  const toggleMute = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setHasInteracted(true);
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    // If unmuting while paused, resume playback smoothly
    if (!nextMuted && video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const container = playerContainerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, []);

  // Scrub through video by clicking progress bar
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = percentage * video.duration;
    setProgress(percentage * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section
      ref={sectionRef}
      id="showcase-reel"
      aria-label="USolve Hero Video Showcase"
      className="relative py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-brand-bg via-brand-bg-alt/40 to-brand-bg-alt/70 border-b border-brand-border/70 overflow-hidden"
    >
      {/* Ambient Radial Backlight Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-5xl h-80 sm:h-[420px] bg-brand-blue/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Subtle Framing Eyebrow & Title */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Badge variant="blue" dot>
              Interactive Showcase
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-navy tracking-tight">
            Code Meets Creativity in Action
          </h2>
          <p className="mt-2 text-sm sm:text-base text-brand-slate max-w-xl mx-auto">
            Experience the technology, precision engineering, and craftsmanship behind USolve digital solutions.
          </p>
        </div>

        {/* Scroll to Scale Animated Video Container */}
        <motion.div
          style={{
            scale: animatedScale,
            opacity: animatedOpacity,
          }}
          className="w-full max-w-6xl mx-auto origin-center"
        >
          <div
            ref={playerContainerRef}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            className="group relative rounded-2xl sm:rounded-3xl bg-brand-navy shadow-elevated border border-brand-border/90 overflow-hidden transition-all duration-300"
          >
            {/* Top Studio Window Header Bar */}
            <div className="bg-brand-navy-dark/95 backdrop-blur-md px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-white/10 flex items-center justify-between select-none">
              {/* Left Studio Window Dots */}
              <div className="flex items-center gap-1.5 sm:gap-2 w-16 sm:w-20">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400/80 inline-block" />
              </div>

              {/* Center Clean Brand Name */}
              <div className="text-center font-heading font-bold text-xs sm:text-sm tracking-wider text-slate-200">
                USolve
              </div>

              {/* Right Balanced Spacer (keeps center text mathematically centered) */}
              <div className="w-16 sm:w-20" aria-hidden="true" />
            </div>

            {/* Video Viewport Container (16:9 Aspect Ratio) with Interactive Hover Cursor Pill */}
            <div
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHoveringVideo(true)}
              onMouseLeave={() => setIsHoveringVideo(false)}
              onClick={togglePlay}
              className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center cursor-pointer md:cursor-none select-none"
            >
              {/* Dynamic Interactive Cursor Pill (Follows cursor on hover) */}
              <AnimatePresence>
                {isHoveringVideo && !isHoveringControls && (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                    style={{
                      left: cursorPos.x,
                      top: cursorPos.y,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="pointer-events-none absolute z-30 hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-brand-navy/90 text-white text-xs font-bold backdrop-blur-md border border-white/25 shadow-2xl shadow-black/60 select-none tracking-wide"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        <span>Play</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <video
                ref={videoRef}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full h-full object-cover select-none pointer-events-none"
                aria-label="USolve Corporate Product and Solutions Video Reel"
              >
                {/* Clean web-safe slug and original filename sources */}
                <source src="/videos/usolve-hero-video.mp4" type="video/mp4" />
                <source src="/videos/USOLVE%20HERO%20VIDEO_.mp4" type="video/mp4" />
                Your browser does not support HTML5 video playback.
              </video>

              {/* Unmute Prompt Pill for Visitors (disappears once clicked) */}
              {isMuted && !hasInteracted && (
                <div
                  onMouseEnter={() => setIsHoveringControls(true)}
                  onMouseLeave={() => setIsHoveringControls(false)}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-4 right-4 z-40 pointer-events-auto"
                >
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label="Unmute video with audio"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-navy/85 hover:bg-brand-blue text-white text-xs font-medium backdrop-blur-md border border-white/20 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                    <span>Unmute Sound</span>
                  </button>
                </div>
              )}

              {/* Glassmorphic Floating Controls Bar */}
              <div
                onMouseEnter={() => setIsHoveringControls(true)}
                onMouseLeave={() => setIsHoveringControls(false)}
                onClick={(e) => e.stopPropagation()}
                className={`absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-40 transition-all duration-300 pointer-events-auto ${
                  showControls || !isPlaying
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-90 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0'
                }`}
              >
                <div className="bg-brand-navy-dark/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-2.5 border border-white/15 shadow-2xl space-y-2">
                  {/* Seek Bar */}
                  <div
                    onClick={handleSeek}
                    className="relative w-full h-1.5 bg-white/20 hover:h-2 rounded-full cursor-pointer overflow-hidden transition-all"
                    role="progressbar"
                    aria-valuenow={Math.round(progress)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Video playback progress"
                  >
                    <div
                      className="h-full bg-gradient-to-r from-brand-blue to-sky-400 rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Playback Button Actions & Time Counter */}
                  <div className="flex items-center justify-between text-white text-xs pt-0.5">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Play / Pause Button */}
                      <button
                        type="button"
                        onClick={togglePlay}
                        aria-label={isPlaying ? 'Pause video' : 'Play video'}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-blue flex items-center justify-center transition-colors text-white"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Mute / Unmute Button */}
                      <button
                        type="button"
                        onClick={toggleMute}
                        aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-blue flex items-center justify-center transition-colors text-white"
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </button>

                      {/* Time Counter */}
                      <span className="font-mono text-[11px] sm:text-xs text-slate-300">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-2">
                      <span className="hidden md:inline-block text-[11px] text-slate-400 font-mono">
                        {isPlaying ? 'Playing' : 'Paused'}
                      </span>
                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        aria-label="Toggle fullscreen"
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-blue flex items-center justify-center transition-colors text-white"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
