import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Github, ArrowUpRight } from 'lucide-react';
import { COMPANY_INFO } from '../../data/company';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white/80 border-t border-brand-navy-dark pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <img
                src="/assets/brand/logo/logo-usolve-transparent.png"
                alt="USolve Logo"
                width="36"
                height="36"
                className="h-9 w-auto brightness-0 invert"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-2xl font-extrabold text-white tracking-tight">USolve</span>
            </Link>
            <p className="text-sm text-white/70 max-w-sm leading-relaxed">
              Code Meets Creativity. We build reliable websites, software systems, AI solutions, and digital marketing strategies that help businesses operate with clarity.
            </p>
            <div className="pt-2 flex flex-col space-y-2 text-sm">
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-brand-blue" />
                <span>{COMPANY_INFO.email}</span>
              </a>
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-blue" />
                <span>{COMPANY_INFO.phoneDisplay}</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/work" className="hover:text-white transition-colors">
                  Our Work
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions & Services */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Solutions</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Custom Software
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Business Automation
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Mobile App Development
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Meta Ads & Marketing
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  AI & Voice Agents
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified Social & Connect */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Connect</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={COMPANY_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4 text-brand-blue" />
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 ml-auto" />
                </a>
              </li>
              <li>
                <a
                  href={COMPANY_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4 text-brand-blue" />
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 ml-auto" />
                </a>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="flex items-center gap-2 hover:text-white transition-colors pt-2 border-t border-white/10"
                >
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© {currentYear} {COMPANY_INFO.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-white/40">Founded in {COMPANY_INFO.foundedLocation}</span>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
