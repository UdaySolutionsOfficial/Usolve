import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Phone, Mail } from 'lucide-react';
import { COMPANY_INFO } from '../../data/company';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll and listen for Escape key when mobile menu is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Our Work', path: '/work' },
    { name: 'About Us', path: '/about' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-brand-border py-3'
            : 'bg-white/80 backdrop-blur-sm border-b border-brand-border/60 py-4 sm:py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg py-1"
            >
              <img
                src="/assets/brand/logo/logo-usolve-transparent.png"
                alt="USolve Logo"
                width="40"
                height="40"
                className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-brand-navy leading-none">
                  USolve
                </span>
                <span className="text-[10px] font-semibold text-brand-blue tracking-wider uppercase mt-0.5">
                  Code Meets Creativity
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      'px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-150 relative',
                      isActive
                        ? 'text-brand-blue bg-brand-blue-light/70 font-semibold'
                        : 'text-brand-slate hover:text-brand-navy hover:bg-brand-bg-alt'
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Header Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Button to="/contact" size="sm" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                Let's Talk
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-brand-slate hover:text-brand-navy hover:bg-brand-bg-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-brand-navy/30 backdrop-blur-xs transition-opacity duration-300 md:hidden',
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <div
        className={cn(
          'fixed top-[60px] sm:top-[68px] left-0 right-0 z-30 bg-white border-b border-brand-border shadow-elevated transition-all duration-300 transform md:hidden overflow-hidden',
          mobileMenuOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        )}
      >
        <div className="px-5 py-6 space-y-4 overflow-y-auto max-h-[80vh]">
          <nav className="flex flex-col space-y-1.5" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2.5 rounded-lg text-base font-medium transition-colors',
                    isActive
                      ? 'bg-brand-blue-light text-brand-blue font-semibold'
                      : 'text-brand-navy hover:bg-brand-bg-alt'
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="pt-4 border-t border-brand-border space-y-3">
            <Button to="/contact" size="lg" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
              Let's Talk About Your Project
            </Button>

            <div className="pt-2 text-xs text-brand-slate space-y-2">
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-2 text-brand-slate hover:text-brand-blue transition-colors py-1"
              >
                <Mail className="w-4 h-4 text-brand-blue" />
                <span>{COMPANY_INFO.email}</span>
              </a>
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex items-center gap-2 text-brand-slate hover:text-brand-blue transition-colors py-1"
              >
                <Phone className="w-4 h-4 text-brand-blue" />
                <span>{COMPANY_INFO.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
