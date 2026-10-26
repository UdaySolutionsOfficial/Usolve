import React from 'react';
import { ExternalLink, Check, Laptop, Info } from 'lucide-react';
import { ProjectItem } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface ProjectCardProps {
  project: ProjectItem;
  onOpenDetails?: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenDetails }) => {
  return (
    <Card
      variant="white"
      padding="none"
      className="flex flex-col h-full group border border-brand-border shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Browser Mockup Top Frame */}
      <div className="bg-brand-bg-alt/90 border-b border-brand-border px-3.5 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-red-400 transition-colors" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-amber-400 transition-colors" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-emerald-400 transition-colors" />
        </div>
        <div className="text-[11px] font-mono text-brand-slate/80 bg-white/80 px-2.5 py-0.5 rounded border border-brand-border/60 max-w-[200px] truncate">
          {project.liveUrl.replace('https://', '').replace(/\/$/, '')}
        </div>
        <Badge variant="blue" className="text-[10px] py-0 px-2">
          {project.category}
        </Badge>
      </div>

      {/* Visual Preview Banner with Hover Zoom */}
      <div className="relative aspect-[16/10] bg-brand-bg-alt overflow-hidden border-b border-brand-border/70">
        {project.imageSrc ? (
          <img
            src={project.imageSrc}
            alt={`${project.name} preview`}
            width="640"
            height="400"
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-bg-alt to-brand-blue-light/30 text-brand-slate">
            <Laptop className="w-8 h-8 text-brand-blue mb-1" />
            <span className="text-xs font-semibold text-brand-navy">{project.name}</span>
          </div>
        )}

        {/* Hover Overlay Button to View Details */}
        {onOpenDetails && (
          <div className="absolute inset-0 bg-brand-navy/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
            <button
              type="button"
              onClick={() => onOpenDetails(project)}
              className="px-4 py-2 rounded-lg bg-white text-brand-navy text-xs font-bold shadow-md hover:bg-brand-blue-light hover:text-brand-blue transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Inspect Scope</span>
            </button>
          </div>
        )}
      </div>

      {/* Card Details Body */}
      <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xl font-extrabold text-brand-navy tracking-tight group-hover:text-brand-blue transition-colors duration-150">
              {project.name}
            </h3>
          </div>

          {project.tagline && (
            <p className="text-xs font-semibold text-brand-blue mt-0.5">
              {project.tagline}
            </p>
          )}

          <p className="text-xs sm:text-sm text-brand-slate leading-relaxed mt-2.5">
            {project.shortSummary}
          </p>

          {/* Verified Scope Points */}
          <div className="mt-4 space-y-1.5 pt-3 border-t border-brand-border/60">
            {project.verifiedDetails.slice(0, 2).map((detail, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-brand-slate">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Footer: Tech tags + Live Link */}
        <div className="pt-4 border-t border-brand-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="text-[11px] font-medium text-brand-slate bg-brand-bg-alt px-2 py-0.5 rounded border border-brand-border/70"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {onOpenDetails && (
              <button
                type="button"
                onClick={() => onOpenDetails(project)}
                className="text-xs font-semibold text-brand-slate hover:text-brand-navy px-2 py-1.5 rounded transition-colors"
                aria-label={`View details for ${project.name}`}
              >
                Details
              </button>
            )}
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-blue text-white text-xs font-semibold hover:bg-brand-blue-hover shadow-xs transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <span>View Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
};
