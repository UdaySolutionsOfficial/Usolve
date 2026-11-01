import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
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
  Sparkles,
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

  const shouldReduceMotion = useReducedMotion();

  // Scroll to scale effect tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  // Smooth scroll scale transformation:
  // Starts at 0.90 scale when entering the viewport, scales smoothly to 1.0 at center
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [0.90, 1.0]);
  const opacityRaw = useTransform(scrollYProgress, [0, 0.4], [0.8, 1.0]);

  // Spring physics for buttery-smooth professional animation without scroll jitter
  const scaleSpring = useSpring(scaleRaw, {
    stiffness: 110,
    damping: 24,
    mass: 0.5,
  });
  const opacitySpring = useSpring(opacityRaw, {
    stiffness: 110,
    damping: 24,
    mass: 0.5,
  });

  const animatedScale = shouldReduceMotion ? 1 : scaleSpring;
  const animatedOpacity = shouldReduceMotion ? 1 : opacitySpring;

  // Autoplay initialization with graceful fallback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Enforce initial muted state for mobile and desktop autoplay policy compliance
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If browser prevented autoplay, remain ready for first user touch
          setIsPlaying(false);
        });
    }
  }, []);

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
      className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-brand-bg via-brand-bg-alt/40 to-brand-bg-alt/70 border-b border-brand-border/70 overflow-hidden"
    >
      {/* Ambient Radial Backlight Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-4xl h-72 sm:h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none"
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
          className="w-full max-w-5xl mx-auto"
        >
          <div
            ref={playerContainerRef}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            onClick={() => setShowControls((prev) => !prev)}
            className="group relative rounded-2xl sm:rounded-3xl bg-brand-navy shadow-elevated border border-brand-border/90 overflow-hidden transition-all duration-300"
          >
            {/* Top Studio Window Header Bar */}
            <div className="bg-brand-navy-dark/95 backdrop-blur-md px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-white/10 flex items-center justify-between select-none">
              {/* Left Mac/Studio Window Dots */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400/80 inline-block" />
                <span className="ml-2 hidden sm:inline-block text-[11px] font-mono text-slate-400">
                  usolve-system-reel.mp4
                </span>
              </div>

              {/* Center Title Pill */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-brand-blue-soft" />
                <span className="tracking-wide">USolve Technology Showcase</span>
              </div>

              {/* Right Telemetry Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  1080p HD
                </span>
              </div>
            </div>

            {/* Video Viewport Container (16:9 Aspect Ratio) */}
            <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full h-full object-cover select-none pointer-events-auto"
                aria-label="USolve Corporate Product and Solutions Video Reel"
              >
                {/* Clean web-safe slug and original filename sources */}
                <source src="/videos/usolve-hero-video.mp4" type="video/mp4" />
                <source src="/videos/USOLVE%20HERO%20VIDEO_.mp4" type="video/mp4" />
                Your browser does not support HTML5 video playback.
              </video>

              {/* Unmute Prompt Pill for Visitors (disappears once clicked) */}
              {isMuted && !hasInteracted && (
                <div className="absolute top-4 right-4 z-20 pointer-events-auto">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label="Unmute video with audio"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-navy/85 hover:bg-brand-blue text-white text-xs font-medium backdrop-blur-md border border-white/20 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                    <span>Unmute Sound</span>
                  </button>
                </div>
              )}

              {/* Glassmorphic Floating Controls Bar */}
              <div
                className={`absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20 transition-all duration-300 pointer-events-auto ${
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
