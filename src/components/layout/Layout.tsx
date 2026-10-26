import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-brand-slate antialiased selection:bg-brand-blue-soft selection:text-brand-navy">
      {/* Accessibility: Skip to Main Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-blue focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-elevated focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <Header />
      <main id="main-content" tabIndex={-1} className="flex-grow pt-20 sm:pt-24 focus:outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
};
