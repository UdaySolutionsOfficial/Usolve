import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Mail,
  Phone,
  Instagram,
  Github,
  Send,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/company';
import { SectionHeading } from '../components/common/SectionHeading';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { SEO } from '../components/common/SEO';
import { ROUTE_SEO, getSiteUrl } from '../utils/seo';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const ContactPage: React.FC = () => {
  const location = useLocation();

  const siteUrl = getSiteUrl();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact USolve',
    description: ROUTE_SEO.contact.description,
    url: `${siteUrl}/contact`,
  };

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    serviceType: 'Website Design & Development',
    message: '',
    _gotcha: '', // Honeypot field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [confirmationStatus, setConfirmationStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [deliveryTimestamp, setDeliveryTimestamp] = useState<string>('');

  // Pre-fill service from URL if passed (e.g. ?service=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('service');
    if (serviceParam) {
      setFormData((prev) => ({ ...prev, serviceType: serviceParam }));
    }
  }, [location.search]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please provide an email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please provide details about your project requirements.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Please provide at least 10 characters so we can understand your request.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions while in progress
    if (status === 'submitting') return;

    if (!validate()) return;

    // Honeypot spam defense (checks both React state and DOM form element)
    const domGotcha = (e.currentTarget as any).elements?.['_gotcha']?.value || '';
    if (formData._gotcha.trim().length > 0 || domGotcha.trim().length > 0) {
      setStatus('success');
      setConfirmationStatus('sent');
      setDeliveryTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      return;
    }

    const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT?.trim();
    if (!endpoint) {
      setStatus('error');
      setErrorMessage(
        'The contact form endpoint is not currently configured. Please send your inquiry directly using the email button below.'
      );
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    setConfirmationStatus('idle');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          service: formData.serviceType,
          message: formData.message.trim(),
          _gotcha: formData._gotcha,
        }),
      });

      if (response.ok) {
        setStatus('success');
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setDeliveryTimestamp(timestamp);

        // Enquiry was received by Formspree! Now request confirmation email via serverless relay
        setConfirmationStatus('sending');
        try {
          const confirmRes = await fetch('/api/send-confirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              name: formData.fullName.trim(),
              email: formData.email.trim(),
              service: formData.serviceType,
              message: formData.message.trim(),
              _gotcha: formData._gotcha,
            }),
          });

          if (confirmRes.ok) {
            const confirmData = await confirmRes.json().catch(() => null);
            if (confirmData && confirmData.success) {
              setConfirmationStatus('sent');
            } else {
              setConfirmationStatus('failed');
            }
          } else {
            setConfirmationStatus('failed');
          }
        } catch {
          // If serverless relay is unconfigured or unreachable, preserve enquiry success
          setConfirmationStatus('failed');
        }
      } else {
        const errorData = await response.json().catch(() => null);
        let errorText =
          'We were unable to deliver your message through the automated gateway. Please use our direct email link below.';

        if (errorData?.errors && Array.isArray(errorData.errors)) {
          errorText =
            errorData.errors
              .map((err: { field?: string; message?: string }) => err.message || err.field)
              .filter(Boolean)
              .join(', ') || errorText;
        } else if (errorData?.error) {
          errorText = errorData.error;
        } else if (errorData?.message) {
          errorText = errorData.message;
        }

        setStatus('error');
        setErrorMessage(errorText);
      }
    } catch {
      // Network or configuration failure: honest error reporting
      setStatus('error');
      setErrorMessage(
        'Delivery endpoint is currently unreachable. Please use the direct email button below to send your inquiry without losing any information.'
      );
    }
  };

  const mailtoUrl = `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
    `Project Inquiry: ${formData.serviceType} from ${formData.fullName}`
  )}&body=${encodeURIComponent(
    `Client Name: ${formData.fullName}\nEmail: ${formData.email}\nService: ${formData.serviceType}\n\nProject Details:\n${formData.message}`
  )}`;

  return (
    <div>
      <SEO
        title={ROUTE_SEO.contact.title}
        description={ROUTE_SEO.contact.description}
        path={ROUTE_SEO.contact.path}
        structuredData={structuredData}
      />
      {/* Contact Hero */}
      <section className="pt-12 pb-16 bg-gradient-to-b from-brand-bg via-brand-bg-alt/50 to-brand-bg border-b border-brand-border/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading
            eyebrow="Get In Touch"
            title="Let's Talk About Your Project"
            description="Whether you need a new website, custom business software, digital marketing, or AI automation, we're here to understand your requirements and discuss practical technical solutions."
            className="mb-0"
          />
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 sm:py-20 bg-brand-bg-alt/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Direct Contact Information Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold text-brand-navy mb-2">
                  Direct Inquiries
                </h3>
                <p className="text-sm text-brand-slate leading-relaxed">
                  Have an urgent project or prefer to speak with us directly? Feel free to call, email, or explore our official channels.
                </p>
              </div>

              {/* Email Card */}
              <Card variant="white" padding="md" className="border border-brand-border shadow-card hover:shadow-card-hover transition-shadow">
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="flex items-start gap-4 group"
                  aria-label={`Send direct email to ${COMPANY_INFO.email}`}
                >
                  <div className="w-11 h-11 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                      Email Address
                    </div>
                    <div className="text-base font-semibold text-brand-blue group-hover:text-brand-blue-hover mt-0.5 break-all">
                      {COMPANY_INFO.email}
                    </div>
                    <div className="text-xs text-brand-slate mt-1">
                      Click to draft an email directly
                    </div>
                  </div>
                </a>
              </Card>

              {/* Phone Card */}
              <Card variant="white" padding="md" className="border border-brand-border shadow-card hover:shadow-card-hover transition-shadow">
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="flex items-start gap-4 group"
                  aria-label={`Call USolve at ${COMPANY_INFO.phoneDisplay}`}
                >
                  <div className="w-11 h-11 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                      Telephone & WhatsApp
                    </div>
                    <div className="text-base font-semibold text-brand-navy group-hover:text-brand-blue mt-0.5">
                      {COMPANY_INFO.phoneDisplay}
                    </div>
                    <div className="text-xs text-brand-slate mt-1">
                      Direct voice & message consultations
                    </div>
                  </div>
                </a>
              </Card>

              {/* Official Social Channels */}
              <Card variant="white" padding="md" className="border border-brand-border shadow-card hover:shadow-card-hover transition-shadow">
                <div className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-3">
                  Verified Social Profiles
                </div>
                <div className="space-y-3">
                  <a
                    href={COMPANY_INFO.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-brand-slate hover:text-brand-blue transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-brand-blue" />
                    <span className="font-medium">instagram.com/usolve_official</span>
                  </a>
                  <a
                    href={COMPANY_INFO.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-brand-slate hover:text-brand-blue transition-colors"
                  >
                    <Github className="w-4 h-4 text-brand-blue" />
                    <span className="font-medium">github.com/UdaySolutionsOfficial</span>
                  </a>
                </div>
              </Card>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7">
              <Card variant="white" padding="lg" className="border border-brand-border shadow-card">
                {status === 'success' ? (
                  <div className="py-6 space-y-6 text-left">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle className="w-7 h-7" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-brand-navy">
                        Inquiry Successfully Transmitted
                      </h3>
                      <p className="mt-2 text-sm text-brand-slate leading-relaxed">
                        Thank you, {formData.fullName}. Your project inquiry has been received by the USolve engineering team ({deliveryTimestamp}). We will review your requirements and respond within 24 business hours.
                      </p>
                    </div>

                    <div className="p-4 bg-brand-bg-alt rounded-xl border border-brand-border text-xs space-y-2 text-brand-slate">
                      <div><strong className="text-brand-navy">Service:</strong> {formData.serviceType}</div>
                      <div><strong className="text-brand-navy">Client Email:</strong> {formData.email}</div>
                      <div><strong className="text-brand-navy">Recipient:</strong> usolveofficial@gmail.com</div>
                      <div className="pt-2 border-t border-brand-border/60">
                        <strong className="text-brand-navy">Confirmation Email: </strong>
                        {confirmationStatus === 'sending' && (
                          <span className="text-brand-blue">Sending confirmation to {formData.email}...</span>
                        )}
                        {confirmationStatus === 'sent' && (
                          <span className="text-emerald-700 font-medium">✓ A confirmation email with your enquiry summary was sent to {formData.email}.</span>
                        )}
                        {confirmationStatus === 'failed' && (
                          <span className="text-brand-slate/80">Enquiry recorded successfully. (Automated confirmation email could not be dispatched, but our engineering team will follow up directly).</span>
                        )}
                        {confirmationStatus === 'idle' && (
                          <span className="text-emerald-700 font-medium">✓ Enquiry recorded.</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => {
                          setStatus('idle');
                          setConfirmationStatus('idle');
                          setFormData({
                            fullName: '',
                            email: '',
                            serviceType: 'Website Design & Development',
                            message: '',
                            _gotcha: '',
                          });
                        }}
                      >
                        Submit Another Inquiry
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="border-b border-brand-border pb-4 mb-5">
                      <h3 className="text-xl font-bold text-brand-navy">
                        Project Inquiry Form
                      </h3>
                      <p className="text-xs text-brand-slate mt-1">
                        Please provide your contact information and a brief description of what you are planning.
                      </p>
                    </div>

                    {/* Anti-spam honeypot (hidden from sighted users and screen readers) */}
                    <div style={{ display: 'none' }} aria-hidden="true">
                      <label htmlFor="_gotcha">Leave this field blank</label>
                      <input
                        type="text"
                        id="_gotcha"
                        name="_gotcha"
                        value={formData._gotcha}
                        onChange={(e) => setFormData({ ...formData, _gotcha: e.target.value })}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    {/* Error Banner if submission failed */}
                    {status === 'error' && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
                        <div className="flex items-start gap-2.5 text-xs sm:text-sm text-red-800">
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <span>{errorMessage}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <Button
                            href={mailtoUrl}
                            size="sm"
                            variant="primary"
                            icon={<Mail className="w-3.5 h-3.5" />}
                          >
                            Send via Email Client
                          </Button>
                          <button
                            type="button"
                            onClick={() => setStatus('idle')}
                            className="text-xs font-semibold text-brand-slate hover:text-brand-navy px-3 py-1.5"
                          >
                            Retry Form
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        disabled={status === 'submitting'}
                        aria-required="true"
                        aria-invalid={!!errors.fullName}
                        aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                        className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-navy placeholder:text-brand-slate/50 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:opacity-60"
                      />
                      {errors.fullName && (
                        <p id="fullName-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rahul@example.com"
                        disabled={status === 'submitting'}
                        aria-required="true"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-navy placeholder:text-brand-slate/50 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:opacity-60"
                      />
                      {errors.email && (
                        <p id="email-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Service Type Selection */}
                    <div>
                      <label htmlFor="serviceType" className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5">
                        Service or Project Type
                      </label>
                      <select
                        id="serviceType"
                        name="service"
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        disabled={status === 'submitting'}
                        className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-navy text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:opacity-60"
                      >
                        <option value="Website Design & Development">Website Design & Development</option>
                        <option value="Web Application Development">Web Application Development</option>
                        <option value="Custom Software Solutions">Custom Software Solutions</option>
                        <option value="Business Automation Systems">Business Automation Systems</option>
                        <option value="Android & iOS Mobile Apps">Android & iOS Mobile Apps</option>
                        <option value="E-commerce Website Development">E-commerce Website Development</option>
                        <option value="Digital Marketing & Meta Ads">Digital Marketing & Meta Ads</option>
                        <option value="Search Engine Optimization (SEO)">Search Engine Optimization (SEO)</option>
                        <option value="Graphic Design & Branding">Graphic Design & Branding</option>
                        <option value="AI-Powered Systems & Voice Agents">AI-Powered Systems & Voice Agents</option>
                        <option value="Maintenance & Support">Maintenance & Support</option>
                        <option value="Other Project Inquiry">Other Project Inquiry</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5">
                        Project Message & Requirements <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us what you're planning, your target audience, or any specific requirements you have..."
                        disabled={status === 'submitting'}
                        aria-required="true"
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                        className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-navy placeholder:text-brand-slate/50 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:opacity-60"
                      />
                      {errors.message && (
                        <p id="message-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.message}</span>
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      variant="primary"
                      className="w-full shadow-sm hover:shadow-md"
                      disabled={status === 'submitting'}
                      icon={
                        status === 'submitting' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )
                      }
                    >
                      {status === 'submitting' ? 'Transmitting Inquiry...' : 'Submit Project Inquiry'}
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
