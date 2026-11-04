import React, { useRef, useEffect } from 'react';

export interface HexagonalVaultProps {
  colors?: string[];
  backgroundColor?: string;
  hexagonSize?: number;
  glowRadius?: number;
  idleAnimation?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  midX: number;
  midY: number;
  afterglow: number;
  spark: number;
}

interface SparkWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
}

export const HexagonalVault: React.FC<HexagonalVaultProps> = ({
  colors = ['#8bf3ff', '#8ca3ff'],
  backgroundColor = '#fbfbfb',
  hexagonSize = 46,
  glowRadius = 185,
  idleAnimation = true,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 600;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Parse theme colors
    const parseHex = (hex: string): [number, number, number] => {
      const clean = hex.replace('#', '');
      const num = parseInt(clean, 16);
      if (clean.length === 3) {
        const r = (num >> 8) & 0xf;
        const g = (num >> 4) & 0xf;
        const b = num & 0xf;
        return [(r << 4) | r, (g << 4) | g, (b << 4) | b];
      }
      return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
    };

    const color1 = parseHex(colors[0] || '#8bf3ff');
    const color2 = parseHex(colors[1] || '#8ca3ff');

    const interpolateColor = (t: number, alpha: number): string => {
      const clamped = Math.max(0, Math.min(1, t));
      const r = Math.round(color1[0] + (color2[0] - color1[0]) * clamped);
      const g = Math.round(color1[1] + (color2[1] - color1[1]) * clamped);
      const b = Math.round(color1[2] + (color2[2] - color1[2]) * clamped);
      return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
    };

    // Edge lattice grid
    let edges: Edge[] = [];

    const buildGrid = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 600;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const r = hexagonSize;
      const dx = 1.5 * r;
      const dy = Math.sqrt(3) * r;

      const cols = Math.ceil(width / dx) + 3;
      const rows = Math.ceil(height / dy) + 3;

      const edgeMap = new Map<string, Edge>();

      for (let c = -2; c <= cols; c++) {
        for (let row = -2; row <= rows; row++) {
          const cx = c * dx;
          const cy = row * dy + (Math.abs(c) % 2 === 1 ? dy / 2 : 0);

          const vertices: Array<[number, number]> = [];
          for (let k = 0; k < 6; k++) {
            const angle = (k * Math.PI) / 3;
            const px = Math.round((cx + r * Math.cos(angle)) * 10) / 10;
            const py = Math.round((cy + r * Math.sin(angle)) * 10) / 10;
            vertices.push([px, py]);
          }

          for (let k = 0; k < 6; k++) {
            const [p1x, p1y] = vertices[k];
            const [p2x, p2y] = vertices[(k + 1) % 6];

            // Normalize edge key
            const isP1Smaller = p1x < p2x || (p1x === p2x && p1y < p2y);
            const key = isP1Smaller
              ? `${p1x},${p1y}_${p2x},${p2y}`
              : `${p2x},${p2y}_${p1x},${p1y}`;

            if (!edgeMap.has(key)) {
              edgeMap.set(key, {
                x1: p1x,
                y1: p1y,
                x2: p2x,
                y2: p2y,
                midX: (p1x + p2x) / 2,
                midY: (p1y + p2y) / 2,
                afterglow: 0,
                spark: 0,
              });
            }
          }
        }
      }

      edges = Array.from(edgeMap.values());
    };

    buildGrid();

    // Mouse & light physics state
    const light = {
      x: width * 0.45,
      y: height * 0.45,
      targetX: width * 0.45,
      targetY: height * 0.45,
      vx: 0,
      vy: 0,
      speed: 0,
      active: true,
      lastMoveTime: performance.now(),
    };

    const sparkWaves: SparkWave[] = [];

    // Pointer move listener
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      light.targetX = clientX - rect.left;
      light.targetY = clientY - rect.top;
      light.active = true;
      light.lastMoveTime = performance.now();
    };

    // Pointer down / click: triggers spark wave racing across hexagon edges
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;

      light.targetX = clickX;
      light.targetY = clickY;
      light.lastMoveTime = performance.now();

      // Spawn rapid spark shockwave
      sparkWaves.push({
        x: clickX,
        y: clickY,
        radius: 5,
        maxRadius: Math.max(width, height) * 0.75,
        speed: 550, // px per second
        alpha: 1,
      });

      // Limit concurrent spark waves to prevent lag
      if (sparkWaves.length > 8) {
        sparkWaves.shift();
      }
    };

    // Listen to window-level events so background responds to cursor ANYWHERE on screen
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const handleWindowResize = () => {
      buildGrid();
    };

    window.addEventListener('resize', handleWindowResize);

    // Animation Render Loop
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      const timeSinceMove = now - light.lastMoveTime;

      // Idle sweep animation when pointer is inactive
      if (idleAnimation && timeSinceMove > 2200) {
        const idleTime = (now - light.lastMoveTime - 2200) * 0.001;
        const sweepX = width * (0.5 + 0.35 * Math.cos(idleTime * 0.65));
        const sweepY = height * (0.5 + 0.3 * Math.sin(idleTime * 0.95));
        // Smoothly steer towards idle path
        light.targetX += (sweepX - light.targetX) * 0.04;
        light.targetY += (sweepY - light.targetY) * 0.04;
      }

      // Smooth spring/damping follower for light position
      const prevX = light.x;
      const prevY = light.y;
      const dx = light.targetX - light.x;
      const dy = light.targetY - light.y;

      light.x += dx * 0.09;
      light.y += dy * 0.09;

      const frameDist = Math.hypot(light.x - prevX, light.y - prevY);
      light.speed = light.speed * 0.85 + frameDist * 0.15;

      // Velocity-based light bloom: glows brighter when moving rapidly
      const dynamicRadius = glowRadius * (1 + Math.min(0.65, light.speed * 0.04));

      // Advance spark waves
      for (let w = sparkWaves.length - 1; w >= 0; w--) {
        const wave = sparkWaves[w];
        wave.radius += wave.speed * dt;
        wave.alpha = Math.max(0, 1 - wave.radius / wave.maxRadius);
        if (wave.radius >= wave.maxRadius || wave.alpha <= 0.01) {
          sparkWaves.splice(w, 1);
        }
      }

      // Clear Canvas
      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Pass 1: Draw resting faint lattice (single batched path for 120 FPS performance)
      ctx.beginPath();
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        ctx.moveTo(e.x1, e.y1);
        ctx.lineTo(e.x2, e.y2);
      }
      ctx.strokeStyle = 'rgba(215, 222, 232, 0.42)'; // Subtle resting blueprint line
      ctx.lineWidth = 1;
      ctx.stroke();

      // Pass 2: Calculate edge illumination, afterglow decay & spark wave collisions
      const litEdges: Array<{ edge: Edge; glow: number; tColor: number }> = [];

      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];

        // Distance from cursor light
        const dist = Math.hypot(e.midX - light.x, e.midY - light.y);
        let directLight = 0;

        if (dist < dynamicRadius) {
          const ratio = 1 - dist / dynamicRadius;
          directLight = Math.pow(ratio, 1.5);
        }

        // Afterglow decay
        if (directLight > e.afterglow) {
          e.afterglow = directLight;
        } else {
          e.afterglow = Math.max(0, e.afterglow - dt * 1.35);
        }

        // Spark wave collision
        let sparkImpact = 0;
        for (let w = 0; w < sparkWaves.length; w++) {
          const wave = sparkWaves[w];
          const distToWaveCenter = Math.hypot(e.midX - wave.x, e.midY - wave.y);
          const distToWaveFront = Math.abs(distToWaveCenter - wave.radius);
          const waveThickness = 28;

          if (distToWaveFront < waveThickness) {
            const frontRatio = 1 - distToWaveFront / waveThickness;
            const impact = frontRatio * wave.alpha;
            if (impact > sparkImpact) sparkImpact = impact;
          }
        }

        e.spark = Math.max(sparkImpact, e.spark - dt * 2.5);

        const totalGlow = Math.min(1.4, Math.max(directLight, e.afterglow) + e.spark * 1.1);

        if (totalGlow > 0.02) {
          // Color distribution across angle/position
          const tColor = (Math.sin(e.midX * 0.005 + e.midY * 0.004) + 1) / 2;
          litEdges.push({ edge: e, glow: totalGlow, tColor });
        }
      }

      // Pass 3: Draw illuminated & glowing edges with smooth gradient interpolation
      for (let i = 0; i < litEdges.length; i++) {
        const { edge, glow, tColor } = litEdges[i];

        ctx.beginPath();
        ctx.moveTo(edge.x1, edge.y1);
        ctx.lineTo(edge.x2, edge.y2);

        // Line width scales with glow intensity
        const lineWidth = 1.2 + glow * 1.8;
        ctx.lineWidth = lineWidth;

        // Color interpolation between #8bf3ff and #8ca3ff
        const strokeAlpha = Math.min(1, 0.2 + glow * 0.85);
        ctx.strokeStyle = interpolateColor(tColor, strokeAlpha);

        // Soft bloom on highly active edges
        if (glow > 0.35) {
          ctx.shadowColor = colors[0];
          ctx.shadowBlur = Math.min(12, glow * 9);
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.stroke();

        // Extra spark highlight (white-hot electric flash along the edge)
        if (edge.spark > 0.4) {
          ctx.beginPath();
          ctx.moveTo(edge.x1, edge.y1);
          ctx.lineTo(edge.x2, edge.y2);
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, edge.spark * 0.95)})`;
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 6;
          ctx.stroke();
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [colors, backgroundColor, hexagonSize, glowRadius, idleAnimation]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      style={{ backgroundColor, ...style }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-none"
      />
    </div>
  );
};

// Also export alias 'M' for exact configuration syntax from React Bits Pro
export const M = HexagonalVault;

export default HexagonalVault;
