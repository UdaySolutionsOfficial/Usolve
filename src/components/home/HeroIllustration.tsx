import React from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Globe,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Activity,
  Layers,
} from 'lucide-react';

export const HeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-[560px] mx-auto aspect-[4/3.5] select-none flex items-center justify-center p-2 sm:p-4">
      {/* Background Multi-Layer Canvas */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-bg-alt via-white to-brand-blue-light/40 rounded-3xl border border-brand-border/80 shadow-elevated overflow-hidden">
        {/* Crisp grid pattern */}
        <div className="absolute inset-0 hero-grid-pattern opacity-50" />

        {/* Ambient Radial Lighting Accents */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-brand-blue/5 rounded-full blur-2xl pointer-events-none" />

        {/* Subtle Decorative Concentric Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-dashed border-brand-border/70 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full border border-brand-border/40 pointer-events-none" />
      </div>

      {/* Dynamic SVG Vector Signal Routes */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 540 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Curved Data Route: Center to Top-Left */}
        <path
          d="M 270 220 C 230 160, 190 120, 130 110"
          stroke="#245BCC"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          strokeOpacity="0.45"
        />
        {/* Curved Data Route: Center to Top-Right */}
        <path
          d="M 270 220 C 320 160, 360 120, 410 100"
          stroke="#245BCC"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          strokeOpacity="0.45"
        />
        {/* Curved Data Route: Center to Bottom-Left */}
        <path
          d="M 270 220 C 210 270, 170 320, 120 330"
          stroke="#245BCC"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          strokeOpacity="0.45"
        />
        {/* Curved Data Route: Center to Bottom-Right */}
        <path
          d="M 270 220 C 330 270, 370 310, 420 320"
          stroke="#245BCC"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          strokeOpacity="0.45"
        />

        {/* Orbit Ring Node Indicators */}
        <circle cx="270" cy="220" r="160" stroke="#DFE6EF" strokeWidth="1" strokeDasharray="3 6" />
      </svg>

      {/* Central Architecture Core */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-20 bg-white/95 backdrop-blur-md border-2 border-brand-blue/30 rounded-2xl p-5 shadow-card-hover text-center max-w-[220px] w-full"
      >
        <div className="w-13 h-13 mx-auto rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-blue-hover flex items-center justify-center text-white mb-2.5 shadow-md shadow-brand-blue/25">
          <Cpu className="w-6 h-6 animate-pulse" />
        </div>
        <div className="text-[11px] uppercase tracking-wider font-extrabold text-brand-blue">
          USolve Core
        </div>
        <div className="text-sm font-extrabold text-brand-navy mt-0.5">
          Digital Solutions Engine
        </div>
        <div className="mt-2.5 pt-2 border-t border-brand-border/60 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Active & Verified</span>
        </div>
      </motion.div>

      {/* Satellite Node 1: Top Left - Web Platforms */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-6 left-4 sm:left-6 z-20 bg-white/90 backdrop-blur-md border border-brand-border rounded-xl p-3 shadow-card hover:border-brand-blue/40 transition-colors flex items-center gap-3 max-w-[195px]"
      >
        <div className="w-9 h-9 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center shrink-0">
          <Globe className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-brand-navy flex items-center gap-1">
            <span>Web Platforms</span>
          </div>
          <div className="text-[10px] text-brand-slate font-medium">Responsive & Fast</div>
        </div>
      </motion.div>

      {/* Satellite Node 2: Top Right - AI Systems */}
      <motion.div
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-6 right-4 sm:right-6 z-20 bg-white/90 backdrop-blur-md border border-brand-border rounded-xl p-3 shadow-card hover:border-brand-blue/40 transition-colors flex items-center gap-3 max-w-[195px]"
      >
        <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-brand-navy">AI & Automation</div>
          <div className="text-[10px] text-brand-slate font-medium">Smart Voice & Bots</div>
        </div>
      </motion.div>

      {/* Satellite Node 3: Bottom Left - Mobile & PWA */}
      <motion.div
        animate={{ y: [3, -5, 3] }}
        transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-4 sm:left-8 z-20 bg-white/90 backdrop-blur-md border border-brand-border rounded-xl p-3 shadow-card hover:border-brand-blue/40 transition-colors flex items-center gap-3 max-w-[190px]"
      >
        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Smartphone className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-brand-navy">Mobile Systems</div>
          <div className="text-[10px] text-brand-slate font-medium">PWA & Cross-Platform</div>
        </div>
      </motion.div>

      {/* Satellite Node 4: Bottom Right - Business Architecture */}
      <motion.div
        animate={{ y: [-3, 5, -3] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 right-4 sm:right-6 z-20 bg-white/90 backdrop-blur-md border border-brand-border rounded-xl p-3 shadow-card hover:border-brand-blue/40 transition-colors flex items-center gap-3 max-w-[200px]"
      >
        <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-brand-navy">Custom Software</div>
          <div className="text-[10px] text-brand-slate font-medium">Scalable Architecture</div>
        </div>
      </motion.div>

      {/* Top Floating Telemetry Micro-Badge */}
      <motion.div
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden sm:flex absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-brand-navy text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-full shadow-md items-center gap-2"
      >
        <Activity className="w-3.5 h-3.5 text-emerald-400" />
        <span>Performance & Reliability First</span>
      </motion.div>

      {/* Bottom Floating Identity Badge */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 bg-white text-brand-navy text-[11px] font-bold px-4 py-1.5 rounded-full border border-brand-border shadow-card flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue" />
        <span>Code Meets Creativity</span>
      </div>
    </div>
  );
};
