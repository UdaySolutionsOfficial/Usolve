import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  ExternalLink,
  Sparkles,
  Lock,
  ArrowUpRight,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { PROJECTS_DATA } from '../../data/projects';
import { ProjectItem } from '../../types';

// The 3 exact featured projects requested by the user
const TARGET_PROJECT_IDS = ['diyasnduas', 'surya-school-bus-tracking', 'sn-olympia-fitness-gym'];

// The archive projects displayed in the 4th CTA card mosaic
const ARCHIVE_PROJECT_IDS = [
  'priyanka-jewellery',
  'ds-fitness-zone',
  'rio-unlimited-restaurant',
  'uday-solutions-portfolio',
];

interface ProjectStackCardProps {
  project: ProjectItem;
  index: number;
  total: number;
}

const ProjectStackCard: React.FC<ProjectStackCardProps> = ({ project, index, total }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Scroll tracking for stacking scale & depth
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
    layoutEffect: false,
  });

  // Calculate subtle scale-down and depth as subsequent cards stack over this card
  const targetScale = 1 - (total - index - 1) * 0.04;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const scrollRotateX = useTransform(scrollYProgress, [0, 1], [0, 4]);
  const brightness = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.95, 0.82]);

  // Clean domain display
  const cleanDomain = project.liveUrl.replace('https://', '').replace(/\/$/, '');

  // 3D Tilt & Glare handler for desktop hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt: max ~4 degrees
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setTilt({ rotateX, rotateY });

    // Glare coordinates (percentage)
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // Sticky top offset staggered by index so the top rim of earlier cards stays visible
  const stickyTop = 88 + index * 14;

  return (
    <div
      ref={containerRef}
      className="relative sticky mb-[26vh] sm:mb-[32vh] lg:mb-[36vh] last:mb-0"
      style={{
        top: `${stickyTop}px`,
        zIndex: 10 + index,
      }}
    >
      <motion.div
        style={{
          scale,
          y,
          rotateX: scrollRotateX,
          opacity,
          filter: brightness,
        }}
        className="w-full origin-top"
      >
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.4s ease-out',
          }}
          className="group relative bg-white/95 backdrop-blur-xl border border-brand-border/80 hover:border-brand-blue/50 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(20,39,68,0.08)] hover:shadow-[0_30px_70px_rgba(36,91,204,0.16)] transition-all duration-300 overflow-hidden"
        >
          {/* Interactive Glare / Specular Sheen on Hover */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 400px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)`,
              }}
            />
          )}

          {/* Browser-style Top Bar */}
          <div className="bg-brand-bg-alt/90 border-b border-brand-border/70 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 text-xs relative z-20">
            {/* Left: Window Controls + Project Number */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <div className="flex items-center gap-1.5 pl-2 border-l border-brand-border/80">
                <span className="font-mono font-bold text-[11px] text-brand-navy">
                  0{index + 1}
                </span>
                <span className="text-slate-300 text-[10px]">/</span>
                <span className="font-mono text-[11px] text-brand-slate">0{total}</span>
              </div>
            </div>

            {/* Center: Domain Pill with external link */}
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-brand-border/70 hover:border-brand-blue/50 text-[11px] sm:text-xs font-mono text-brand-navy transition-colors truncate max-w-[200px] sm:max-w-xs shadow-2xs group/link"
              title={`Open live site: ${cleanDomain}`}
            >
              <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{cleanDomain}</span>
              <ArrowUpRight className="w-3 h-3 text-brand-slate group-hover/link:text-brand-blue shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>

            {/* Right: Live Production Pill */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">Live Production</span>
                <span className="sm:hidden">Live</span>
              </span>
            </div>
          </div>

          {/* Main Visual Thumbnail Area: Focused, High-Impact Screenshot */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[2/1] lg:aspect-[2.2/1] bg-slate-900/5 overflow-hidden group/thumb">
            <img
              src={project.imageSrc}
              alt={`${project.name} live preview`}
              width="1200"
              height="600"
              loading="lazy"
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover/thumb:scale-104"
            />

            {/* Subtle glass lighting overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/5 pointer-events-none" />

            {/* Clickable Hover Overlay to View Details */}
            <Link
              to={`/work?project=${project.id}`}
              className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 bg-brand-navy/25 backdrop-blur-[2px]"
              title={`View ${project.name} details on Our Work page`}
            >
              <span className="px-5 py-2.5 rounded-xl bg-white/95 text-brand-navy text-xs sm:text-sm font-bold shadow-xl flex items-center gap-2 transform translate-y-2 group-hover/thumb:translate-y-0 transition-transform duration-200 hover:bg-white hover:text-brand-blue">
                <span>View Details on Our Work Page</span>
                <ArrowRight className="w-4 h-4 text-brand-blue" />
              </span>
            </Link>
          </div>

          {/* Simple, Professional Bottom Bar: ONLY Title, Category, and Small View Details CTA */}
          <div className="p-4 sm:p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white relative z-20 border-t border-brand-border/60">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-blue">
                {project.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-brand-navy tracking-tight mt-0.5">
                {project.name}
              </h3>
            </div>

            {/* Small Sleek View Details CTA Button */}
            <div className="flex items-center gap-2.5 pt-1 sm:pt-0">
              <Link
                to={`/work?project=${project.id}`}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group/btn"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-brand-bg-alt hover:bg-brand-blue-light text-brand-slate hover:text-brand-blue border border-brand-border/80 transition-colors"
                title={`Visit ${project.name} live`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// 4th Card: View More / Explore All Projects CTA Card
interface PortfolioCtaCardProps {
  index: number;
  total: number;
  archiveProjects: ProjectItem[];
}

const PortfolioCtaCard: React.FC<PortfolioCtaCardProps> = ({
  index,
  total,
  archiveProjects,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const stickyTop = 88 + index * 14;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3.5;
    const rotateY = ((x - centerX) / centerX) * 3.5;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="relative sticky mb-12 sm:mb-16"
      style={{
        top: `${stickyTop}px`,
        zIndex: 10 + index,
      }}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.4s ease-out',
        }}
        className="relative bg-gradient-to-br from-[#0E1C33] via-[#142744] to-[#0A1628] text-white border border-brand-blue/30 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(20,39,68,0.25)] overflow-hidden"
      >
        {/* Futuristic glowing ambient lights */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Bar */}
        <div className="bg-white/[0.04] border-b border-white/10 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <span className="font-mono font-bold text-[11px] text-cyan-300">
                0{index + 1}
              </span>
              <span className="text-white/30">/</span>
              <span className="font-mono text-[11px] text-white/60">0{total}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono text-cyan-200">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>usolve.digital/work</span>
          </div>

          <div className="text-[11px] font-semibold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-400/20">
            Complete Archive
          </div>
        </div>

        {/* Main Body */}
        <div className="p-5 sm:p-7 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
          {/* Left Column: Heading & CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Selected Portfolio Archive</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2.5">
                Explore All Our Works
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                From fine jewellery showrooms and fitness clubs to culinary dining platforms and creative 3D web applications, explore our full portfolio of delivered solutions.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/work"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-blue/40 hover:shadow-brand-blue/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group/btn"
              >
                <span>View All Projects</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-medium border border-white/20 transition-colors"
              >
                <span>Discuss Your Project</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 2x2 Mini Archive Mosaic */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
              {archiveProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/work?project=${p.id}`}
                  className="group/mini relative rounded-xl overflow-hidden bg-white/[0.06] border border-white/10 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-lg p-2 sm:p-2.5 flex flex-col"
                  title={`View ${p.name} on Our Work page`}
                >
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-900/60 mb-2">
                    {p.imageSrc ? (
                      <img
                        src={p.imageSrc}
                        alt={`${p.name} preview`}
                        width="300"
                        height="180"
                        loading="lazy"
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/mini:scale-108"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <Sparkles className="w-5 h-5 text-cyan-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute bottom-1.5 left-2 text-[9px] sm:text-[10px] font-semibold text-cyan-300 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs">
                      {p.category.split('&')[0]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] sm:text-xs font-bold text-white truncate group-hover/mini:text-cyan-300 transition-colors">
                      {p.name}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/mini:text-cyan-300 group-hover/mini:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FeaturedProjects: React.FC = () => {
  // Filter the exact 3 projects requested
  const featured = TARGET_PROJECT_IDS.map((id) =>
    PROJECTS_DATA.find((p) => p.id === id)
  ).filter((p): p is ProjectItem => Boolean(p));

  // The remaining 4 archive projects for the CTA mosaic card
  const archiveProjects = ARCHIVE_PROJECT_IDS.map((id) =>
    PROJECTS_DATA.find((p) => p.id === id)
  ).filter((p): p is ProjectItem => Boolean(p));

  const totalCards = featured.length + 1; // 3 projects + 1 CTA card = 4 total

  return (
    <section className="relative py-20 sm:py-28 bg-gradient-to-b from-white via-brand-bg-alt/40 to-white border-b border-brand-border/70 overflow-x-clip">
      {/* Subtle background ambient lights */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-blue/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue-light border border-brand-blue/20 text-brand-blue text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Selected Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
              Our Works
            </h2>
            <p className="mt-3 text-base sm:text-lg text-brand-slate leading-relaxed">
              Explore live websites and applications engineered by USolve. Click any project to inspect full case details.
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <Link
              to="/work"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-brand-bg-alt text-brand-navy text-sm font-semibold border border-brand-border hover:border-brand-blue/40 shadow-xs transition-all duration-200 group"
            >
              <span>Explore All 7 Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Futuristic On-Scroll Stacking Cards Container */}
        <div className="relative">
          {featured.map((project, index) => (
            <ProjectStackCard
              key={project.id}
              project={project}
              index={index}
              total={totalCards}
            />
          ))}

          {/* Card 4: View More / Explore All Projects CTA Card */}
          <PortfolioCtaCard
            index={featured.length}
            total={totalCards}
            archiveProjects={archiveProjects}
          />
        </div>
      </div>
    </section>
  );
};
