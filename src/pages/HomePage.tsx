import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { HeroVideoSection } from '../components/home/HeroVideoSection';
import { ServicesOverview } from '../components/home/ServicesOverview';
import { FeaturedProjects } from '../components/home/FeaturedProjects';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { HowWeWork } from '../components/home/HowWeWork';
import { AboutPreview } from '../components/home/AboutPreview';
import { CtaSection } from '../components/home/CtaSection';
import { SEO } from '../components/common/SEO';
import { ROUTE_SEO, getOrganizationSchema, getWebSiteSchema } from '../utils/seo';

export const HomePage: React.FC = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [getOrganizationSchema(), getWebSiteSchema()],
  };

  return (
    <div>
      <SEO
        title={ROUTE_SEO.home.title}
        description={ROUTE_SEO.home.description}
        path={ROUTE_SEO.home.path}
        structuredData={structuredData}
      />
      <HeroSection />
      <HeroVideoSection />
      <ServicesOverview />
      <FeaturedProjects />
      <WhyChooseUs />
      <HowWeWork />
      <AboutPreview />
      <CtaSection />
    </div>
  );
};
