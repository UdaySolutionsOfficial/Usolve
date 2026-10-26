import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/common/ScrollToTop';
import { Button } from './components/common/Button';
import { ArrowLeft, HelpCircle, Loader2 } from 'lucide-react';

// Code-split pages for performance optimization
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const WorkPage = lazy(() => import('./pages/WorkPage').then((m) => ({ default: m.WorkPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const FaqsPage = lazy(() => import('./pages/FaqsPage').then((m) => ({ default: m.FaqsPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })));

const PageLoader: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center py-20 text-brand-slate" aria-label="Loading page content">
    <Loader2 className="w-8 h-8 text-brand-blue animate-spin mb-3" />
    <span className="text-xs font-semibold uppercase tracking-wider text-brand-slate/80">Loading USolve Experience...</span>
  </div>
);

const NotFoundPage: React.FC = () => {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 text-center max-w-xl mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mx-auto mb-6">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mb-3">
        Page Not Found
      </h1>
      <p className="text-sm sm:text-base text-brand-slate mb-8 leading-relaxed">
        The page you are looking for doesn't exist or has been relocated. You can return to our homepage or explore our services.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button to="/" variant="primary" size="md" icon={<ArrowLeft className="w-4 h-4" />} iconPosition="left">
          Return to Homepage
        </Button>
        <Button to="/services" variant="outline" size="md">
          View All Services
        </Button>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faqs" element={<FaqsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
