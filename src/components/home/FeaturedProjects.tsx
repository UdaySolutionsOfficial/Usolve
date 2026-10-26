import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PROJECTS_DATA } from '../../data/projects';
import { SectionHeading } from '../common/SectionHeading';
import { ProjectCard } from '../work/ProjectCard';
import { ProjectModal } from '../work/ProjectModal';
import { Button } from '../common/Button';
import { ProjectItem } from '../../types';

export const FeaturedProjects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Take top 6 verified projects for the homepage
  const featured = PROJECTS_DATA.slice(0, 6);

  return (
    <section className="py-20 sm:py-24 bg-white border-b border-brand-border/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <SectionHeading
            eyebrow="Portfolio of Delivered Work"
            title="Real Solutions Built for Real Businesses"
            description="Explore live websites and applications engineered by USolve. Each project represents practical design, responsive layouts, and reliable technology."
            align="left"
            className="mb-0 max-w-2xl"
          />
          <div className="mt-6 md:mt-0">
            <Button
              to="/work"
              variant="outline"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              View All 7 Projects
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featured.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenDetails={(p) => setSelectedProject(p)}
            />
          ))}
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
