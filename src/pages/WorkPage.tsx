import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PROJECTS_DATA } from '../data/projects';
import { SectionHeading } from '../components/common/SectionHeading';
import { ProjectCard } from '../components/work/ProjectCard';
import { ProjectModal } from '../components/work/ProjectModal';
import { CtaSection } from '../components/home/CtaSection';
import { SEO } from '../components/common/SEO';
import { ROUTE_SEO, getSiteUrl } from '../utils/seo';
import { ProjectItem } from '../types';
import { cn } from '../utils/cn';

export const WorkPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<'all' | 'apps' | 'fitness' | 'retail' | 'archive'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Auto-open project details modal if requested via URL query, e.g. /work?project=diyasnduas
  useEffect(() => {
    const projectId = searchParams.get('project');
    if (projectId) {
      const target = PROJECTS_DATA.find((p) => p.id === projectId);
      if (target) {
        setSelectedProject(target);
      }
    }
  }, [searchParams]);

  const filterButtons = [
    { id: 'all', label: `All Projects (${PROJECTS_DATA.length})` },
    { id: 'apps', label: 'Web Applications & Systems' },
    { id: 'fitness', label: 'Fitness & Gyms' },
    { id: 'retail', label: 'Retail & Dining' },
    { id: 'archive', label: 'Studio Archive' },
  ];

  const filteredProjects = PROJECTS_DATA.filter((project) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'apps') {
      return (
        project.id === 'surya-school-bus-tracking' ||
        project.category.toLowerCase().includes('app') ||
        project.category.toLowerCase().includes('systems')
      );
    }
    if (activeFilter === 'fitness') {
      return project.id === 'sn-olympia-fitness-gym' || project.id === 'ds-fitness-zone';
    }
    if (activeFilter === 'retail') {
      return (
        project.id === 'diyasnduas' ||
        project.id === 'priyanka-jewellery' ||
        project.id === 'rio-unlimited-restaurant'
      );
    }
    if (activeFilter === 'archive') {
      return project.id === 'uday-solutions-portfolio';
    }
    return true;
  });

  const siteUrl = getSiteUrl();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'USolve Project Portfolio',
    description: ROUTE_SEO.work.description,
    url: `${siteUrl}/work`,
    hasPart: PROJECTS_DATA.map((p) => ({
      '@type': 'CreativeWork',
      name: p.name,
      description: p.shortSummary,
      url: p.liveUrl,
    })),
  };

  return (
    <div>
      <SEO
        title={ROUTE_SEO.work.title}
        description={ROUTE_SEO.work.description}
        path={ROUTE_SEO.work.path}
        structuredData={structuredData}
      />

      {/* Work Page Hero */}
      <section className="pt-12 pb-16 bg-gradient-to-b from-brand-bg via-brand-bg-alt/50 to-brand-bg border-b border-brand-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading
            eyebrow="Portfolio of Verified Solutions"
            title="Real Projects Delivered for Real Clients"
            description="Explore our verified portfolio of live websites, web applications, and digital systems. Every project below is linked to its genuine live deployment with authentic preview captures and grounded scope descriptions."
            className="mb-8"
          />

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setActiveFilter(btn.id as any)}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue',
                  activeFilter === btn.id
                    ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                    : 'bg-white text-brand-slate border-brand-border hover:bg-brand-bg-alt hover:text-brand-navy'
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 sm:py-20 bg-brand-bg-alt/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenDetails={(p) => setSelectedProject(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Reusable Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <CtaSection />
    </div>
  );
};
