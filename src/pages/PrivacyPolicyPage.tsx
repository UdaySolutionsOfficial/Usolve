import React from 'react';
import { COMPANY_INFO } from '../data/company';
import { SectionHeading } from '../components/common/SectionHeading';
import { Card } from '../components/common/Card';
import { SEO } from '../components/common/SEO';
import { ROUTE_SEO } from '../utils/seo';
import { Shield, Mail, Phone, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div>
      <SEO
        title={ROUTE_SEO.privacyPolicy.title}
        description={ROUTE_SEO.privacyPolicy.description}
        path={ROUTE_SEO.privacyPolicy.path}
      />

      {/* Privacy Policy Hero */}
      <section className="pt-12 pb-16 bg-gradient-to-b from-brand-bg via-brand-bg-alt/50 to-brand-bg border-b border-brand-border/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading
            eyebrow="Corporate Governance"
            title="Privacy Policy"
            description="Our straightforward commitment to safeguarding personal information and being transparent about data handling practices."
            className="mb-0"
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20 bg-brand-bg-alt/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Transparent Governance Status */}
          <div className="p-4 bg-brand-blue-light/60 border border-brand-blue/20 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-brand-navy shadow-xs">
            <Shield className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
            <p>
              <strong>Governance Transparency:</strong> This policy reflects USolve's actual data collection implementation for Phase 3 launch readiness. No background analytics trackers, tracking cookies, or advertising pixels are embedded in this codebase.
            </p>
          </div>

          <Card variant="white" padding="lg" className="border border-brand-border shadow-card space-y-8 text-brand-slate text-sm sm:text-base leading-relaxed">
            {/* Section 1 */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-brand-navy">
                <FileText className="w-5 h-5 text-brand-blue" />
                <h2 className="text-xl font-bold">1. Information Voluntarily Provided</h2>
              </div>
              <p>
                When you interact with USolve through our contact forms or direct communications, you may provide personal details such as your full name, email address, telephone number, business or organization name, and project specifications. We only collect details that you deliberately submit to initiate an inquiry or request technical consultations.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-brand-navy">
                <CheckCircle2 className="w-5 h-5 text-brand-blue" />
                <h2 className="text-xl font-bold">2. How Inquiry Information Is Used</h2>
              </div>
              <p>
                The information you submit is used strictly for legitimate business communications:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
                <li>Evaluating project requirements and formulating itemized scope proposals.</li>
                <li>Direct communication regarding technical milestones, schedules, and quotations.</li>
                <li>Responding to questions regarding web development, custom software, and AI systems.</li>
                <li>Maintaining administrative records of active client dialogues.</li>
              </ul>
              <p className="mt-2 text-sm">
                We do not sell, rent, monetize, or lease your contact information or personal data to third-party advertisers, data aggregators, or brokers under any circumstances.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-brand-navy">
                <Lock className="w-5 h-5 text-brand-blue" />
                <h2 className="text-xl font-bold">3. Form Delivery & Third-Party Processing</h2>
              </div>
              <p>
                Contact form inquiries submitted via our website are processed through our configured secure transmission gateway (such as a serverless email API or verified form delivery service) and dispatched directly to the official company inbox at <code>usolveofficial@gmail.com</code>. We do not store inquiry messages in an unsecured public database.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-2">4. Data Security Principles</h2>
              <p>
                We employ industry-standard transport layer encryption (HTTPS/TLS) across all website assets and form submissions to prevent interception during transit. While no digital transmission channel can guarantee absolute invulnerability, we implement appropriate server-side access controls and spam prevention safeguards to protect submitted records.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-2">5. Cookies & Tracking Technologies</h2>
              <p>
                The USolve corporate website currently functions without third-party tracking cookies, marketing beacons, or invasive browser fingerprinting. If performance analytics or customer portal authentication cookies are introduced in future phases, this policy will be updated with explicit user disclosures.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-2">6. External Links to Client Projects</h2>
              <p>
                Our portfolio features direct links to live client websites and external platforms. Once you click an external link, you leave the USolve corporate domain. We do not control the privacy practices, content, or security policies of third-party domains.
              </p>
            </div>

            {/* Section 7 */}
            <div className="pt-4 border-t border-brand-border">
              <h2 className="text-xl font-bold text-brand-navy mb-2">7. Contact for Privacy Inquiries</h2>
              <p className="mb-4">
                If you have questions regarding this Privacy Policy or wish to request the review, modification, or deletion of inquiry details you have shared, please contact us:
              </p>
              <div className="space-y-2 text-sm text-brand-navy">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-blue" />
                  <span>Email:</span>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="text-brand-blue hover:underline">
                    {COMPANY_INFO.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-blue" />
                  <span>Phone:</span>
                  <a href={`tel:${COMPANY_INFO.phone}`} className="text-brand-blue hover:underline">
                    {COMPANY_INFO.phoneDisplay}
                  </a>
                </div>
                <div className="text-xs text-brand-slate pt-2">
                  Company: USolve | Founder & CEO: Uday Kiran Tippani | Co-founder: Jabeed Shaik
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
