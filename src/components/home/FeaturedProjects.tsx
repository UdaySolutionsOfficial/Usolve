import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  ExternalLink,
  Sparkles,
  Lock,
  Info,
  CheckCircle2,
  ChevronRight,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { PROJECTS_DATA } from '../../data/projects';
import { ProjectModal } from '../work/ProjectModal';
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
  onOpenDetails: (project: ProjectItem) => void;
}

const ProjectStackCard: React.FC<ProjectStackCardProps> = ({
  project,
  index,
  total,
  onOpenDetails,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Scroll tracking for stacking scale & depth
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
    layoutEffect: false,
  });

  // Calculate subtle scale-down as subsequent cards stack over this card
  // Earlier cards scale down more, later cards scale down less
  const targetScale = 1 - (total - index - 1) * 0.035;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const brightness = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  // Clean domain display
  const cleanDomain = project.liveUrl.replace('https://', '').replace(/\/$/, '');

  // 3D Tilt handler for desktop hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // max ~4.5 degrees for smooth subtle feel
    const rotateX = ((y - centerY) / centerY) * -4.5;
    const rotateY = ((x - centerX) / centerX) * 4.5;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // Sticky top offset staggered by index so the top rim of earlier cards stays visible
  // Base offset clears the header (approx 72px) with comfortable breathing room
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
          className="group relative bg-white/95 backdrop-blur-xl border border-brand-border/80 hover:border-brand-blue/40 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(20,39,68,0.08)] hover:shadow-[0_25px_60px_rgba(36,91,204,0.12)] transition-shadow duration-300 overflow-hidden"
        >
          {/* Subtle decorative background gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-brand-blue/[0.04] via-transparent to-transparent pointer-events-none rounded-tr-3xl" />

          {/* Browser-style Top Bar */}
          <div className="bg-brand-bg-alt/90 border-b border-brand-border/70 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 text-xs">
            {/* Left: Window Controls + Project Number */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-brand-border/80">
                <span className="font-mono font-bold text-[11px] text-brand-navy">
                  0{index + 1}
                </span>
                <span className="text-slate-300">/</span>
                <span className="font-mono text-[11px] text-brand-slate">0{total}</span>
              </div>
            </div>

            {/* Center: Domain Pill */}
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-brand-border/70 hover:border-brand-blue/50 text-[11px] sm:text-xs font-mono text-brand-navy transition-colors truncate max-w-[220px] sm:max-w-xs shadow-2xs group/link"
              title={`Open ${cleanDomain} in new tab`}
            >
              <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{cleanDomain}</span>
              <ArrowUpRight className="w-3 h-3 text-brand-slate group-hover/link:text-brand-blue shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>

            {/* Right: Category Badge & Status */}
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Production
              </span>
              <span className="text-[11px] font-semibold text-brand-blue bg-brand-blue-light px-2.5 py-0.5 rounded-full border border-brand-blue/15 truncate max-w-[140px] sm:max-w-none">
                {project.category}
              </span>
            </div>
          </div>

          {/* Card Main Body */}
          <div className="p-5 sm:p-7 lg:p-9 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column (Desktop) / Bottom Column (Mobile): Project Overview */}
            <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Eyebrow Tagline */}
                {project.tagline && (
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-blue mb-1.5">
                    {project.tagline}
                  </p>
                )}

                {/* Project Title */}
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-navy tracking-tight leading-tight mb-2 sm:mb-3">
                  {project.name}
                </h3>

                {/* Concise Summary */}
                <p className="text-xs sm:text-sm lg:text-base text-brand-slate leading-relaxed mb-4 sm:mb-5">
                  {project.shortSummary}
                </p>

                {/* Highlights / Verified Features */}
                <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                  {project.verifiedDetails.slice(0, 2).map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-brand-navy">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-blue shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-medium text-brand-navy bg-brand-bg-alt rounded-md border border-brand-border/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2 border-t border-brand-border/60">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 group/btn"
                >
                  <span>Visit Live Website</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>

                <button
                  type="button"
                  onClick={() => onOpenDetails(project)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white hover:bg-brand-bg-alt text-brand-navy text-xs sm:text-sm font-medium border border-brand-border hover:border-brand-blue/30 shadow-2xs transition-colors"
                >
                  <Info className="w-3.5 h-3.5 text-brand-slate" />
                  <span>Inspect Scope</span>
                </button>
              </div>
            </div>

            {/* Right Column (Desktop) / Top Column (Mobile): Screenshot Window Preview */}
            <div className="order-1 lg:order-2 lg:col-span-7">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative rounded-xl sm:rounded-2xl overflow-hidden border border-brand-border/80 bg-brand-bg-alt shadow-inner group/preview focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
                title={`Visit ${project.name}`}
              >
                {/* Browser top sub-bar */}
                <div className="bg-slate-100/90 border-b border-brand-border/70 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  </div>
                  <span className="font-mono text-[10px] text-brand-slate/80 truncate">
                    {cleanDomain}
                  </span>
                  <ExternalLink className="w-3 h-3 text-brand-slate/60" />
                </div>

                {/* Screenshot Image with hover zoom */}
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={project.imageSrc}
                    alt={`${project.name} live preview`}
                    width="800"
                    height="500"
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover/preview:scale-105"
                  />

                  {/* Subtle glass reflection gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none" />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-brand-navy/30 backdrop-blur-[1px] opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-lg bg-white/95 text-brand-navy text-xs font-bold shadow-lg flex items-center gap-2 transform translate-y-2 group-hover/preview:translate-y-0 transition-transform duration-200">
                      <span>Open Live Website</span>
                      <ExternalLink className="w-3.5 h-3.5 text-brand-blue" />
                    </span>
                  </div>
                </div>
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
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
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
        <div className="bg-white/[0.04] border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 text-xs">
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

        {/* Card Main Body */}
        <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Heading & CTA */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Selected Portfolio Archive</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                Want to Explore More of What We&apos;ve Built?
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                From fine jewellery showrooms and strength fitness portals to restaurant culinary menus and interactive 3D web applications, explore our full track record of delivered solutions.
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.05] border border-white/10 text-center sm:text-left">
                  <div className="text-lg sm:text-xl font-extrabold text-cyan-300">7+</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5">Delivered</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.05] border border-white/10 text-center sm:text-left">
                  <div className="text-lg sm:text-xl font-extrabold text-cyan-300">100%</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5">Verified</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.05] border border-white/10 text-center sm:text-left">
                  <div className="text-lg sm:text-xl font-extrabold text-cyan-300">Live</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5">Production</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/work"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-bold shadow-lg shadow-brand-blue/40 hover:shadow-brand-blue/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group/btn"
              >
                <span>View All Projects</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium border border-white/20 transition-colors"
              >
                <span>Discuss Your Project</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 2x2 Mini Archive Mosaic */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {archiveProjects.map((p) => (
                <Link
                  key={p.id}
                  to="/work"
                  className="group/mini relative rounded-xl overflow-hidden bg-white/[0.06] border border-white/10 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-lg p-2.5 flex flex-col"
                >
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-900/60 mb-2.5">
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
                    <span className="absolute bottom-1.5 left-2 text-[10px] font-semibold text-cyan-300 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs">
                      {p.category.split('&')[0]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-white truncate group-hover/mini:text-cyan-300 transition-colors">
                      {p.name}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/mini:text-cyan-300 group-hover/mini:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/work"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-white transition-colors"
              >
                <span>Click any project to inspect live case studies &amp; verified scopes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FeaturedProjects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
              Explore live websites and applications engineered by USolve. Each project represents practical design, responsive layouts, and reliable technology.
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
          {/* Card 1: DiyasNduas */}
          {/* Card 2: Surya School Bus Tracking */}
          {/* Card 3: S.N. Olympia Fitness Gym */}
          {featured.map((project, index) => (
            <ProjectStackCard
              key={project.id}
              project={project}
              index={index}
              total={totalCards}
              onOpenDetails={(p) => setSelectedProject(p)}
            />
          ))}

          {/* Card 4: View More / Explore All Projects CTA Card */}
          <PortfolioCtaCard
            index={featured.length}
            total={totalCards}
            archiveProjects={archiveProjects}
          />
        </div>

        {/* Reusable Project Details Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
};
