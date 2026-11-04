import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: number;
  pulseSpeed: number;
  phase: number;
}

export const HeroCrystallineLogo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse tracking state
  const [isHovered, setIsHovered] = useState(false);
  const [glintPos, setGlintPos] = useState({ x: 50, y: 50 });

  // Motion values for smooth 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics configuration for weighted, luxurious feel
  const springConfig = { damping: 22, stiffness: 130, mass: 0.8 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D rotation mappings
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-16, 16]);
  const translateZ = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12]);

  // Handle mouse move over container
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Normalized from -0.5 to 0.5
    mouseX.set(x - 0.5);
    mouseY.set(y - 0.5);

    // Percentage for specular glint
    setGlintPos({
      x: Math.round(x * 100),
      y: Math.round(y * 100),
    });
  }, [mouseX, mouseY]);

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    setGlintPos({ x: 50, y: 50 });
  };

  // Interactive Liquid Caustics Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize flowing fluid / liquid particles
    const particleCount = 32;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 80 + Math.random() * 120;
      particles.push({
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1.2,
        alpha: Math.random() * 0.4 + 0.2,
        hue: Math.random() > 0.35 ? 188 : 215, // 188 = Electric Cyan (#00D2FF), 215 = Sapphire Blue (#245BCC)
        pulseSpeed: 0.02 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Mouse influence position in canvas space
      const currentMouseX = (mouseX.get() + 0.5) * width;
      const currentMouseY = (mouseY.get() + 0.5) * height;

      // Draw subtle orbital fluid rings
      ctx.save();
      for (let ring = 0; ring < 2; ring++) {
        const ringRadius = 130 + ring * 45;
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          ringRadius - 12,
          centerX,
          centerY,
          ringRadius + 12
        );
        gradient.addColorStop(0, 'rgba(139, 243, 255, 0)');
        gradient.addColorStop(0.5, ring === 0 ? 'rgba(0, 210, 255, 0.07)' : 'rgba(36, 91, 204, 0.04)');
        gradient.addColorStop(1, 'rgba(139, 243, 255, 0)');

        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 14;
        ctx.stroke();
      }
      ctx.restore();

      // Update & render flowing liquid particles
      particles.forEach((p, idx) => {
        p.phase += p.pulseSpeed;
        const currentAlpha = p.alpha + Math.sin(p.phase) * 0.15;

        // Gentle orbital pull towards center
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Circular flow velocity
        const tangentX = -dy / (dist || 1);
        const tangentY = dx / (dist || 1);

        p.vx += tangentX * 0.032;
        p.vy += tangentY * 0.032;

        // Interactive mouse gravity when hovered
        if (isHovered) {
          const mdx = currentMouseX - p.x;
          const mdy = currentMouseY - p.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 190 && mdist > 10) {
            p.vx += (mdx / mdist) * 0.07;
            p.vy += (mdy / mdist) * 0.07;
          }
        }

        // Apply friction
        p.vx *= 0.96;
        p.vy *= 0.96;

        p.x += p.vx;
        p.y += p.vy;

        // Keep inside bounds
        const boundaryDist = Math.hypot(p.x - centerX, p.y - centerY);
        if (boundaryDist > 220 || boundaryDist < 50) {
          p.x = centerX + (Math.cos(idx + frame * 0.01) * (90 + (idx % 90)));
          p.y = centerY + (Math.sin(idx + frame * 0.01) * (90 + (idx % 90)));
        }

        // Draw particle with luminous glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${Math.max(0, currentAlpha)})`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, 0.8)`;
        ctx.shadowBlur = p.size * 3;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isHovered, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none cursor-pointer"
      style={{ perspective: 1200 }}
    >
      {/* 1. Interactive Fluid Caustic Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* 2. Ambient Crystalline Glow Halo & Orbital Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Soft cyan & blue ambient aura */}
        <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-[#8bf3ff]/35 via-[#2E68B2]/20 to-transparent blur-3xl" />
        
        {/* Inner rotating dotted orbital guide ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[330px] h-[330px] rounded-full border border-dashed border-cyan-400/25 pointer-events-none"
        />

        {/* Outer counter-rotating subtle thin ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[420px] h-[420px] rounded-full border border-brand-border/40 pointer-events-none"
        />

        {/* Frosted Glass Floating Pedestal Disk */}
        <div className="absolute w-64 h-64 rounded-full bg-white/40 backdrop-blur-md border border-white/70 shadow-[0_20px_50px_rgba(36,91,204,0.08)] pointer-events-none" />
      </div>

      {/* 3. Interactive 3D Tilting Stage with Spring Physics */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          translateZ,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="relative z-10 w-[290px] sm:w-[340px] md:w-[380px] aspect-square flex items-center justify-center"
      >
        {/* Dynamic drop shadow with 3D offset */}
        <motion.div
          style={{
            transform: 'translateZ(-30px)',
          }}
          className="absolute inset-8 rounded-full bg-brand-navy/15 blur-2xl pointer-events-none transition-transform duration-300"
        />

        {/* Continuous Fluid Shimmer / Specular Glint Across Liquid Core */}
        <motion.div
          animate={{
            opacity: [0.35, 0.75, 0.35],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-10 rounded-full bg-gradient-to-tr from-cyan-400/25 via-sky-300/30 to-transparent blur-xl pointer-events-none"
        />

        {/* The 3D Emblem Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src="/assets/brand/logo/usolve-3d-crystalline-sapphire-cyan.png"
            alt="USolve 3D Crystalline Logo"
            width={380}
            height={380}
            className="w-full h-full object-contain filter drop-shadow-[0_15px_35px_rgba(0,194,255,0.28)] select-none pointer-events-none"
            draggable={false}
          />

          {/* Interactive Specular Glint Overlay tracking cursor angle */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl mix-blend-overlay transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 140px at ${glintPos.x}% ${glintPos.y}%, rgba(255,255,255,0.85) 0%, rgba(139,243,255,0.3) 40%, transparent 70%)`,
              opacity: isHovered ? 0.9 : 0.3,
            }}
          />

          {/* Liquid flow light wave that slides continuously */}
          <motion.div
            animate={{
              x: ['-120%', '120%'],
            }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 1.5,
            }}
            className="absolute inset-0 w-full h-full pointer-events-none mix-blend-color-dodge opacity-60"
            style={{
              background: 'linear-gradient(105deg, transparent 20%, rgba(0, 210, 255, 0.35) 45%, rgba(255, 255, 255, 0.6) 50%, rgba(0, 210, 255, 0.35) 55%, transparent 80%)',
            }}
          />
        </div>

        {/* Floating crystalline micro-nodes at depth for enhanced parallax */}
        <motion.div
          style={{ transform: 'translateZ(50px)' }}
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-8 right-6 w-3 h-3 rounded-full bg-cyan-300/80 shadow-[0_0_12px_#00D2FF] pointer-events-none"
        />
        <motion.div
          style={{ transform: 'translateZ(35px)' }}
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-12 left-8 w-2 h-2 rounded-full bg-blue-400/80 shadow-[0_0_10px_#245BCC] pointer-events-none"
        />
      </motion.div>
    </div>
  );
};
