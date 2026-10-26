import React, { useEffect } from 'react';
import { X, ExternalLink, Check } from 'lucide-react';
import { ProjectItem } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-2xl border border-brand-border shadow-elevated w-full max-w-3xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-brand-bg-alt border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="blue">{project.category}</Badge>
            <span className="text-xs text-brand-slate font-medium hidden sm:inline">
              Verified Project Showcase
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-slate hover:text-brand-navy hover:bg-white border border-transparent hover:border-brand-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Authentic Preview Image in Browser Mockup */}
          {project.imageSrc && (
            <div className="rounded-xl border border-brand-border/80 overflow-hidden shadow-sm bg-brand-bg-alt">
              <div className="px-4 py-2.5 bg-brand-bg-alt border-b border-brand-border flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="mx-auto text-[11px] text-brand-slate font-mono bg-white px-3 py-0.5 rounded border border-brand-border/60 max-w-[240px] truncate">
                  {project.liveUrl.replace('https://', '')}
                </div>
              </div>
              <img
                src={project.imageSrc}
                alt={`${project.name} live preview`}
                className="w-full h-auto max-h-[360px] object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <div>
            <h3 className="text-2xl font-extrabold text-brand-navy">
              {project.name}
            </h3>
            {project.tagline && (
              <p className="text-sm font-semibold text-brand-blue mt-0.5">
                {project.tagline}
              </p>
            )}
            <p className="text-sm sm:text-base text-brand-slate leading-relaxed mt-3">
              {project.shortSummary}
            </p>
          </div>

          {/* Verified Scope Points */}
          <div className="space-y-2 pt-4 border-t border-brand-border/70">
            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
              Verified Deliverables:
            </h4>
            <div className="space-y-1.5">
              {project.verifiedDetails.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-slate">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies Used */}
          <div className="pt-4 border-t border-brand-border/70">
            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
              Architecture & Technologies:
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs font-medium text-brand-navy bg-brand-bg-alt px-3 py-1 rounded-md border border-brand-border"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-brand-bg-alt/70 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-brand-slate">
            External links open directly in a secure new tab.
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
              Close
            </Button>
            <Button
              href={project.liveUrl}
              external
              size="sm"
              variant="primary"
              className="w-full sm:w-auto"
              icon={<ExternalLink className="w-4 h-4" />}
            >
              Open Live Website
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
