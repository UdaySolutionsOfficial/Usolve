import React from 'react';
import { motion } from 'framer-motion';
import { Service3DItem } from './service3dData';

interface Service3dVisualProps {
  service: Service3DItem;
}

export const Service3dVisual: React.FC<Service3dVisualProps> = ({ service }) => {
  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-w-lg mx-auto flex items-center justify-center select-none perspective-[1200px]">
      {/* Background Soft Glow Aura */}
      <div
        className={`absolute inset-0 bg-gradient-to-tr ${service.bgGlow} blur-3xl opacity-60 rounded-full scale-110 pointer-events-none transition-all duration-700`}
        aria-hidden="true"
      />

      {/* Floating Ambient Particles / Background Grid */}
      <div className="absolute inset-0 rounded-2xl border border-brand-border/40 bg-white/40 backdrop-blur-xs p-4 sm:p-6 shadow-card overflow-hidden">
        <div className="absolute inset-0 hero-grid-pattern opacity-30 pointer-events-none" />

        {/* 3D Visual Content by Type */}
        <div className="relative w-full h-full flex items-center justify-center">
          {service.visualType === 'web' && <WebVisual />}
          {service.visualType === 'custom-software' && <SoftwareVisual />}
          {service.visualType === 'mobile' && <MobileVisual />}
          {service.visualType === 'marketing' && <MarketingVisual />}
          {service.visualType === 'ai' && <AiVisual />}
          {service.visualType === 'ecommerce' && <EcommerceVisual />}
          {service.visualType === 'branding' && <BrandingVisual />}
          {service.visualType === 'seo' && <SeoVisual />}
        </div>
      </div>

      {/* Orbiting / Floating 3D Pills */}
      {service.floatingPills.map((pill, idx) => {
        const Icon = pill.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, idx % 2 === 0 ? -6 : 6, 0],
            }}
            transition={{
              y: {
                duration: 3 + idx * 0.7,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
            }}
            className={`absolute z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-brand-border/90 shadow-elevated text-xs font-semibold text-brand-navy pointer-events-none ${pill.className}`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 text-brand-blue" />}
            <span className="whitespace-nowrap">{pill.text}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

/* --- 1. Web & Web App 3D Visual --- */
const WebVisual: React.FC = () => (
  <motion.div
    animate={{ rotateY: [-4, 4, -4], rotateX: [3, -3, 3] }}
    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    className="w-full h-full flex flex-col justify-between rounded-xl bg-gradient-to-br from-white to-brand-bg-alt border border-brand-border shadow-elevated overflow-hidden p-3 sm:p-4"
    style={{ transformStyle: 'preserve-3d' }}
  >
    {/* Browser Header Bar */}
    <div className="flex items-center justify-between pb-2 border-b border-brand-border/70">
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
      </div>
      <div className="px-3 py-0.5 rounded-md bg-white border border-brand-border/80 text-[10px] font-mono text-brand-slate flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        https://usolve.in
      </div>
      <div className="text-[10px] font-semibold text-brand-blue">React 18</div>
    </div>

    {/* Web Mockup Body */}
    <div className="grid grid-cols-12 gap-3 flex-1 pt-3 items-center">
      {/* Left Code Mockup */}
      <div className="col-span-7 bg-brand-navy-dark rounded-lg p-2.5 text-[10px] font-mono text-slate-300 space-y-1 shadow-inner overflow-hidden">
        <div className="text-emerald-400">// Next-Gen Web Platform</div>
        <div>
          <span className="text-sky-400">const</span>{' '}
          <span className="text-amber-300">Application</span> = () =&gt; &#123;
        </div>
        <div className="pl-2 text-slate-400">
          return &lt;<span className="text-cyan-300">ModernExperience</span> /&gt;;
        </div>
        <div>&#125;;</div>
        <div className="pt-1 flex items-center gap-2 text-[9px] text-emerald-400 border-t border-white/10 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 0ms TTFB • Vite 6.0
        </div>
      </div>

      {/* Right UI Preview Cards */}
      <div className="col-span-5 space-y-2">
        <div className="p-2 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-between">
          <span className="text-[10px] font-bold text-brand-navy">Performance</span>
          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-white px-1.5 py-0.5 rounded shadow-xs">
            100
          </span>
        </div>
        <div className="p-2 rounded-lg bg-white border border-brand-border shadow-xs space-y-1">
          <div className="h-2 w-3/4 bg-brand-navy/15 rounded" />
          <div className="h-1.5 w-1/2 bg-brand-slate/20 rounded" />
        </div>
      </div>
    </div>

    {/* Bottom Status Pill */}
    <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between text-[10px] text-brand-slate">
      <span>High-Velocity TypeScript</span>
      <span className="font-semibold text-brand-blue">Ultra-Fast SSR / SPA</span>
    </div>
  </motion.div>
);

/* --- 2. Custom Software 3D Visual --- */
const SoftwareVisual: React.FC = () => (
  <motion.div
    animate={{ rotateY: [4, -4, 4], rotateX: [-2, 2, -2] }}
    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    className="w-full h-full flex flex-col justify-between rounded-xl bg-gradient-to-br from-white to-brand-bg-alt border border-brand-border shadow-elevated p-3 sm:p-4"
    style={{ transformStyle: 'preserve-3d' }}
  >
    {/* Header */}
    <div className="flex items-center justify-between pb-2 border-b border-brand-border/70">
      <div className="flex items-center gap-2 text-xs font-bold text-brand-navy">
        <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
        System Architecture
      </div>
      <span className="text-[10px] font-mono text-brand-slate bg-brand-bg-alt px-2 py-0.5 rounded border border-brand-border">
        Node: Cluster-US01
      </span>
    </div>

    {/* Architecture Node Diagram */}
    <div className="flex-1 flex flex-col justify-center gap-2.5 py-2">
      {/* Node Row 1: Client Gateway */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 p-2 bg-blue-50 border border-blue-200 rounded-lg text-center text-[10px] font-bold text-brand-navy shadow-xs">
          Client UI & PWAs
        </div>
        <span className="text-xs text-brand-blue">→</span>
        <div className="flex-1 p-2 bg-indigo-50 border border-indigo-200 rounded-lg text-center text-[10px] font-bold text-indigo-900 shadow-xs">
          API Gateway
        </div>
        <span className="text-xs text-brand-blue">→</span>
        <div className="flex-1 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-center text-[10px] font-bold text-emerald-900 shadow-xs">
          Services
        </div>
      </div>

      {/* Database Cluster Block */}
      <div className="p-2.5 bg-brand-navy text-white rounded-lg flex items-center justify-between text-[11px] shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-slate-300">PostgreSQL Relational DB</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">99.99% Uptime</span>
      </div>
    </div>

    <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between text-[10px] text-brand-slate">
      <span>Zero Vendor Lock-In</span>
      <span className="font-semibold text-brand-blue">Automated Backups</span>
    </div>
  </motion.div>
);

/* --- 3. Mobile App 3D Visual --- */
const MobileVisual: React.FC = () => (
  <motion.div
    animate={{ rotateY: [-5, 5, -5], y: [-3, 3, -3] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    className="w-48 sm:w-56 h-full mx-auto flex flex-col rounded-2xl bg-brand-navy p-2.5 shadow-elevated border-2 border-slate-700 relative"
    style={{ transformStyle: 'preserve-3d' }}
  >
    {/* Phone Notch & Speaker */}
    <div className="w-20 h-3 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-slate-900 mr-2" />
      <div className="w-6 h-1 rounded-full bg-slate-900" />
    </div>

    {/* Phone Inner Screen */}
    <div className="flex-1 bg-white rounded-xl p-2.5 flex flex-col justify-between overflow-hidden shadow-inner">
      {/* App Topbar */}
      <div className="flex items-center justify-between pb-1.5 border-b border-brand-border/70">
        <span className="text-[10px] font-extrabold text-brand-navy">USolve Mobile</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
      </div>

      {/* Screen Content Tiles */}
      <div className="space-y-1.5 py-1">
        <div className="p-1.5 bg-emerald-50 border border-emerald-200 rounded text-[9px] font-semibold text-emerald-900 flex items-center justify-between">
          <span>Active Transit Tracking</span>
          <span>Live GPS</span>
        </div>
        <div className="p-1.5 bg-brand-bg-alt border border-brand-border rounded space-y-1">
          <div className="h-1.5 w-4/5 bg-brand-navy/20 rounded" />
          <div className="h-1.5 w-3/5 bg-brand-slate/20 rounded" />
        </div>
      </div>

      {/* App Bottom Navigation */}
      <div className="pt-1.5 border-t border-brand-border/70 flex justify-around text-[9px] text-brand-slate font-medium">
        <span className="text-brand-blue font-bold">Home</span>
        <span>Orders</span>
        <span>Account</span>
      </div>
    </div>
  </motion.div>
);

/* --- 4. Marketing & Meta Ads 3D Visual --- */
const MarketingVisual: React.FC = () => (
  <motion.div
    animate={{ rotateX: [3, -3, 3], rotateY: [3, -3, 3] }}
    transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
    className="w-full h-full flex flex-col justify-between rounded-xl bg-gradient-to-br from-white to-brand-bg-alt border border-brand-border shadow-elevated p-3 sm:p-4"
  >
    <div className="flex items-center justify-between pb-2 border-b border-brand-border/70">
      <div className="flex items-center gap-1.5 text-xs font-bold text-brand-navy">
        <span className="w-2 h-2 rounded-full bg-purple-600" />
        Meta Ads Funnel Analytics
      </div>
      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
        +340% ROAS
      </span>
    </div>

    {/* Simulated Analytics Bar Chart */}
    <div className="flex-1 flex items-end justify-between gap-2 pt-3 pb-1 px-2">
      {[35, 55, 45, 75, 60, 95].map((val, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
          <motion.div
            initial={{ height: '20%' }}
            animate={{ height: `${val}%` }}
            transition={{ duration: 1.2, delay: idx * 0.1, repeat: Infinity, repeatType: 'reverse', repeatDelay: 3 }}
            className={`w-full rounded-t-md ${
              idx === 5
                ? 'bg-gradient-to-t from-purple-600 to-indigo-500 shadow-md'
                : 'bg-gradient-to-t from-purple-200 to-indigo-200'
            }`}
          />
          <span className="text-[9px] text-brand-slate font-mono">W{idx + 1}</span>
        </div>
      ))}
    </div>

    <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between text-[10px] text-brand-slate">
      <span>High-Intent Lead Targeting</span>
      <span className="font-semibold text-purple-700">Verified Conversion Tracking</span>
    </div>
  </motion.div>
);

/* --- 5. AI-Powered Systems & Voice Agents Visual --- */
const AiVisual: React.FC = () => (
  <motion.div
    animate={{ rotateY: [-4, 4, -4] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    className="w-full h-full flex flex-col justify-between rounded-xl bg-brand-navy text-white p-3 sm:p-4 shadow-elevated border border-slate-700"
  >
    <div className="flex items-center justify-between pb-2 border-b border-white/10">
      <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        USolve Conversational AI Core
      </div>
      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
        Streaming
      </span>
    </div>

    {/* Voice Waveform Visualizer */}
    <div className="flex-1 flex flex-col justify-center items-center py-2 space-y-3">
      <div className="flex items-center gap-1.5 h-12">
        {[20, 45, 80, 100, 60, 90, 40, 75, 30].map((h, i) => (
          <motion.div
            key={i}
            animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] }}
            transition={{ duration: 0.8 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-full"
          />
        ))}
      </div>
      <div className="text-[10px] font-mono text-cyan-200/80 bg-white/5 px-3 py-1 rounded-full border border-white/10">
        Natural Speech Synthesis • Sub-300ms Response
      </div>
    </div>

    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
      <span>24/7 Smart Answering</span>
      <span className="font-semibold text-cyan-300">Real-Time Lead Capture</span>
    </div>
  </motion.div>
);

/* --- 6. E-commerce Solutions Visual --- */
const EcommerceVisual: React.FC = () => (
  <motion.div
    animate={{ rotateY: [3, -3, 3] }}
    transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
    className="w-full h-full flex flex-col justify-between rounded-xl bg-gradient-to-br from-white to-brand-bg-alt border border-brand-border shadow-elevated p-3 sm:p-4"
  >
    <div className="flex items-center justify-between pb-2 border-b border-brand-border/70">
      <div className="flex items-center gap-1.5 text-xs font-bold text-brand-navy">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        Digital Storefront & Checkout
      </div>
      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
        SSL Secure
      </span>
    </div>

    {/* Storefront Products Grid Preview */}
    <div className="flex-1 grid grid-cols-2 gap-2.5 py-2 items-center">
      <div className="p-2 rounded-lg bg-white border border-brand-border shadow-xs space-y-1">
        <div className="h-10 bg-amber-50 rounded flex items-center justify-center text-amber-700 font-bold text-xs">
          Product A
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="font-bold text-brand-navy">₹1,499</span>
          <span className="text-[9px] text-emerald-600 font-semibold">In Stock</span>
        </div>
      </div>
      <div className="p-2 rounded-lg bg-white border border-brand-border shadow-xs space-y-1">
        <div className="h-10 bg-blue-50 rounded flex items-center justify-center text-blue-700 font-bold text-xs">
          Product B
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="font-bold text-brand-navy">₹2,899</span>
          <span className="text-[9px] text-emerald-600 font-semibold">In Stock</span>
        </div>
      </div>
    </div>

    <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between text-[10px] text-brand-slate">
      <span>Instant UPI & Card Checkout</span>
      <span className="font-semibold text-amber-600">Automated Order Alerts</span>
    </div>
  </motion.div>
);

/* --- 7. Graphic Design & Branding Visual --- */
const BrandingVisual: React.FC = () => (
  <motion.div
    animate={{ rotateX: [3, -3, 3], rotateY: [-3, 3, -3] }}
    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    className="w-full h-full flex flex-col justify-between rounded-xl bg-gradient-to-br from-white to-brand-bg-alt border border-brand-border shadow-elevated p-3 sm:p-4"
  >
    <div className="flex items-center justify-between pb-2 border-b border-brand-border/70">
      <div className="flex items-center gap-1.5 text-xs font-bold text-brand-navy">
        <span className="w-2 h-2 rounded-full bg-pink-500" />
        Design System & Brand Tokens
      </div>
      <span className="text-[10px] font-mono text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
        Tokens v2.0
      </span>
    </div>

    {/* Brand Color Swatches & Typo Preview */}
    <div className="flex-1 flex flex-col justify-center gap-2 py-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#245BCC] shadow-xs flex items-center justify-center text-[8px] text-white font-mono">
          #245BCC
        </div>
        <div className="w-8 h-8 rounded-lg bg-[#142744] shadow-xs flex items-center justify-center text-[8px] text-white font-mono">
          #142744
        </div>
        <div className="w-8 h-8 rounded-lg bg-[#06B6D4] shadow-xs flex items-center justify-center text-[8px] text-white font-mono">
          #06B6D4
        </div>
        <div className="w-8 h-8 rounded-lg bg-[#F5F8FC] border border-brand-border shadow-xs flex items-center justify-center text-[8px] text-brand-navy font-mono">
          #F5F8FC
        </div>
      </div>
      <div className="p-2 rounded bg-white border border-brand-border flex items-center justify-between">
        <span className="font-heading font-extrabold text-base text-brand-navy">Manrope & Inter</span>
        <span className="text-[10px] text-brand-slate">Precision Vector Kit</span>
      </div>
    </div>

    <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between text-[10px] text-brand-slate">
      <span>Crisp Scalable SVGs</span>
      <span className="font-semibold text-pink-600">Cross-Platform Identity</span>
    </div>
  </motion.div>
);

/* --- 8. SEO & Growth Visual --- */
const SeoVisual: React.FC = () => (
  <motion.div
    animate={{ rotateY: [3, -3, 3] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    className="w-full h-full flex flex-col justify-between rounded-xl bg-gradient-to-br from-white to-brand-bg-alt border border-brand-border shadow-elevated p-3 sm:p-4"
  >
    <div className="flex items-center justify-between pb-2 border-b border-brand-border/70">
      <div className="flex items-center gap-1.5 text-xs font-bold text-brand-navy">
        <span className="w-2 h-2 rounded-full bg-teal-500" />
        Google Search Indexation
      </div>
      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
        Rank #1
      </span>
    </div>

    {/* Search Snippet Simulation */}
    <div className="flex-1 flex flex-col justify-center space-y-1.5 py-1">
      <div className="p-2.5 rounded-lg bg-white border border-brand-border shadow-xs space-y-1">
        <div className="text-[10px] text-brand-slate font-mono">https://usolve.in &gt; services</div>
        <div className="text-xs font-bold text-blue-700 hover:underline">
          USolve — Software & Digital Solutions India
        </div>
        <div className="text-[10px] text-brand-slate line-clamp-1">
          Code Meets Creativity. Delivering websites, custom software, and AI systems.
        </div>
        <div className="flex items-center gap-1 text-[9px] text-amber-500 font-semibold pt-0.5">
          ★★★★★ <span className="text-brand-slate font-normal">(4.9/5 verified client reviews)</span>
        </div>
      </div>
    </div>

    <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between text-[10px] text-brand-slate">
      <span>JSON-LD Structured Schema</span>
      <span className="font-semibold text-teal-600">Core Web Vitals Pass</span>
    </div>
  </motion.div>
);
