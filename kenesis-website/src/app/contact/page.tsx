'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';

const GlitchBackground = dynamic(
  () => import('@/components/magicui/glitch-background').then(m => ({ default: m.GlitchBackground })),
  { ssr: false }
);

const facilitySizes = [
  'Small (< 50 cameras)',
  'Medium (50–200 cameras)',
  'Large (200+ cameras)',
  'Enterprise / Multi-site',
];

function FloatingField({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="group relative">
      <span className="block font-mono-accent text-[11px] uppercase text-white/25 mb-[8px] transition-colors group-focus-within:text-amber-400/60">
        {label}
      </span>
      {children}
      {hint && (
        <p className="mt-[6px] font-mono-accent text-[10px] text-white/15">{hint}</p>
      )}
      <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-amber-400/50 transition-all duration-300 group-focus-within:w-full" />
    </div>
  );
}

function CustomSelect({ options, placeholder }: { options: string[]; placeholder: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className={`${inputCls} flex items-center justify-between cursor-pointer text-left w-full`}
      >
        <span className={selected ? 'text-white/80' : 'text-white/20'}>{selected || placeholder}</span>
        <svg className={`w-[16px] h-[16px] text-white/20 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-[8px] z-50 rounded-[16px] overflow-hidden"
          style={{
            background: 'rgba(18,18,22,0.95)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1) inset',
          }}
        >
          {options.map(opt => (
            <button key={opt} type="button"
              onClick={() => { setSelected(opt); setOpen(false); }}
              className="w-full text-left px-[20px] py-[14px] text-[14px] text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const inputCls =
  'w-full bg-transparent border-0 border-b border-white/10 pb-[12px] pt-[4px] ' +
  'font-display text-[16px] text-white/80 placeholder:text-white/20 ' +
  'focus:outline-none focus:border-amber-400/40 transition-colors duration-200';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [bgReady, setBgReady] = useState(false);

  // Defer GlitchBackground — use setTimeout fallback for Safari which lacks requestIdleCallback
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      const id = (window as Window & { requestIdleCallback: (cb: () => void, opts?: object) => number })
        .requestIdleCallback(() => setBgReady(true), { timeout: 2000 });
      return () => {
        if ('cancelIdleCallback' in window) {
          (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id);
        }
      };
    } else {
      const id = setTimeout(() => setBgReady(true), 300);
      return () => clearTimeout(id);
    }
  }, []);

  return (
    <PageShell>
      {/* Glitch background - deferred load */}
      {bgReady && (
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.07]"
          style={{
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)',
          }}
        >
          <GlitchBackground
            glitchColors={['#f59e0b', '#d97706', '#fbbf24']}
            glitchSpeed={80}
            smooth
            outerVignette={false}
            density={0.03}
          />
        </div>
      )}

      {/* Ambient amber glow top-right */}
      <div className="pointer-events-none fixed top-0 right-0 w-[60vw] h-[60vh] z-0"
        style={{ background: 'radial-gradient(ellipse at 80% 10%, rgba(245,158,11,0.06) 0%, transparent 65%)' }} />

      <div className="relative z-[1] min-h-screen">
        {/* ── Top bar ── */}
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8 md:px-16 pt-[2rem] sm:pt-[4rem] md:pt-[8rem] pb-[2rem] sm:pb-[4rem] md:pb-[6rem]">
          <BlurFade delay={0.05} duration={0.5} blur="6px" offset={10}>
            <div className="flex items-center gap-3 mb-[2rem] sm:mb-[4rem]">
              <span className="h-[1px] w-[3rem] bg-amber-400/40" />
              <span className="font-mono-accent text-[1rem] uppercase text-amber-400/50">
                Contact
              </span>
            </div>
          </BlurFade>

          {/* ── Hero headline ── */}
          <BlurFade delay={0.1} duration={0.7} blur="12px" offset={24}>
            <h1 className="font-display text-[clamp(28px,9vw,72px)] font-semibold leading-[0.95] text-white/90 max-w-[16ch]">
              Let&apos;s discuss<br />
              <span className="text-amber-400/80">your safety</span><br />
              infrastructure.
            </h1>
          </BlurFade>

          <BlurFade delay={0.3} duration={0.6} blur="8px" offset={16}>
            <p className="mt-[2rem] sm:mt-[3rem] max-w-[640px] font-display text-[14px] sm:text-[18px] leading-[1.65] text-white/35 font-light">
              Schedule a walkthrough of our platform. We\'ll connect to your cameras and show you what Kenesis sees, no commitment required.
            </p>
          </BlurFade>
        </div>

        {/* ── Main grid ── */}
        <div className="mx-auto max-w-[1280px] px-4 md:px-8 lg:px-16 pb-[6rem] md:pb-[12rem]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-[3rem] md:gap-[4rem] lg:gap-[10rem] [&>*]:order-none">

            {/* Left - info */}
            <BlurFade delay={0.2} duration={0.8} blur="10px" offset={20}>
              <div className="order-2 lg:order-1 space-y-[3rem] sm:space-y-[5rem]">
                {/* Divider */}
                <div className="h-[1px] w-full bg-white/8" />

                <div>
                  <p className="font-mono-accent text-[1rem] uppercase text-amber-400/40 mb-[2rem]">
                    Office
                  </p>
                  <p className="font-display text-[16px] sm:text-[20px] font-medium text-white/80 leading-[1.5]">
                    Kenesis Labs<br />
                    <a
                      href="https://maps.app.goo.gl/U6VuU7J7AE1FNXck8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/35 font-light text-[1.1rem] sm:text-[16px] hover:text-amber-400 transition-colors duration-200"
                    >
                      iTamilnadu Technology Hub (iTNT)<br />
                      Anna University, Sir C V Raman Science Block, 3rd Floor<br />
                      Kotturpuram, Chennai, Tamil Nadu 600025
                    </a>
                  </p>
                </div>

                <div>
                  <p className="font-mono-accent text-[1rem] uppercase text-amber-400/40 mb-[2rem]">
                    Email
                  </p>
                  <a
                    href="mailto:admin@kenesis.ai"
                    className="font-display text-[16px] sm:text-[20px] font-medium text-white/70 hover:text-amber-400 transition-colors duration-200 cursor-pointer break-all"
                  >
                    admin@kenesis.ai
                  </a>
                </div>

                <div>
                  <p className="font-mono-accent text-[1rem] uppercase text-amber-400/40 mb-[2rem]">
                    Phone
                  </p>
                  <a
                    href="tel:+919342281662"
                    className="font-display text-[16px] sm:text-[20px] font-medium text-white/70 hover:text-amber-400 transition-colors duration-200 cursor-pointer"
                  >
                    +91 93422 81662
                  </a>
                  <p className="font-display text-[14px] text-white/25 mt-[0.4rem]">Available during business hours (India Standard Time)</p>
                </div>

                <div>
                  <p className="font-mono-accent text-[1rem] uppercase text-amber-400/40 mb-[2rem]">
                    Hours
                  </p>
                  <p className="font-display text-[18px] font-medium text-white/50 font-light">
                    Mon – Fri, 9:00 AM – 6:00 PM India Standard Time<br />
                    <span className="text-white/25 text-[14px]">We respond within 24–48 hours</span>
                  </p>
                </div>
              </div>
            </BlurFade>

            {/* Right - form */}
            <BlurFade delay={0.35} duration={0.8} blur="10px" offset={20}>
              <div className="order-1 lg:order-2">
                {submitted ? (
                  <div className="flex flex-col items-start justify-center h-full min-h-[40rem] gap-6">
                    <div className="h-[1px] w-[6rem] bg-amber-400/60" />
                    <p className="font-display text-[36px] font-semibold text-white/90 leading-[1.1]">
                      Message<br />received.
                    </p>
                    <p className="font-display text-[17px] text-white/35 font-light">
                      We&apos;ll be in touch within 24 hours.
                    </p>
                  </div>
                ) : (
                <form
                  className="space-y-[32px]"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSending(true);
                    setError('');
                    const form = e.currentTarget;
                    const data = {
                      name: (form.elements.namedItem('name') as HTMLInputElement)?.value,
                      email: (form.elements.namedItem('email') as HTMLInputElement)?.value,
                      company: (form.elements.namedItem('company') as HTMLInputElement)?.value,
                      facilitySize: (form.querySelector('[data-facility]') as HTMLElement)?.textContent || '',
                      message: (form.elements.namedItem('message') as HTMLTextAreaElement)?.value,
                    };
                    try {
                      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                      if (res.ok) { setSubmitted(true); } else { const j = await res.json(); setError(j.error || 'Something went wrong.'); }
                    } catch { setError('Network error. Please try again.'); }
                    setSending(false);
                  }}
                >
                  {/* Name + Email side by side on large screens */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1.5rem] sm:gap-[3rem]">
                    <FloatingField label="Name">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        autoComplete="name"
                        required
                        className={inputCls}
                      />
                    </FloatingField>
                    <FloatingField label="Email">
                      <input
                        type="email"
                        name="email"
                        placeholder="you@company.com"
                        autoComplete="email"
                        required
                        className={inputCls}
                      />
                    </FloatingField>
                  </div>

                  <FloatingField label="Company" hint="e.g. Tata Steel, Blast furnace plant">
                    <input
                      type="text"
                      name="company"
                      placeholder="Company & facility type"
                      autoComplete="organization"
                      className={inputCls}
                    />
                  </FloatingField>

                  <FloatingField label="Facility size">
                    <CustomSelect
                      options={facilitySizes}
                      placeholder="Select facility size"
                    />
                  </FloatingField>

                  <FloatingField label="Message">
                    <textarea
                      name="message"
                      placeholder="Tell us about your requirements: camera count, use cases, timeline..."
                      rows={5}
                      className={inputCls + ' resize-none'}
                    />
                  </FloatingField>

                  {/* Submit */}
                  <div className="pt-[1rem] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    <button
                      type="submit"
                      disabled={sending}
                      className="group relative overflow-hidden rounded-full px-[2.4rem] sm:px-[3.2rem] py-[1.2rem] sm:py-[1.4rem] font-mono-accent text-[1rem] sm:text-[14px] uppercase font-semibold text-[#0a0a0b] cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                      style={{
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                        boxShadow: '0 0 40px rgba(245,158,11,0.25), 0 4px 16px rgba(245,158,11,0.2)',
                      }}
                    >
                      <span className="relative z-[1]">{sending ? 'Sending...' : 'Request a demo'}</span>
                      {/* shimmer */}
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                    </button>
                    <p className="font-mono-accent text-[1rem] text-white/20">
                      No commitment required
                    </p>
                    {error && <p className="font-mono-accent text-[1rem] text-red-400">{error}</p>}
                  </div>
                </form>
                )}
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

