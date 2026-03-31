'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';

const GlitchBackground = dynamic(
  () => import('@/components/magicui/glitch-background').then(m => ({ default: m.GlitchBackground })),
  { ssr: false, loading: () => null }
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
      <span className="block font-mono-accent text-[11px] uppercase tracking-[0.14em] text-white/25 mb-[8px] transition-colors group-focus-within:text-amber-400/60">
        {label}
      </span>
      {children}
      {hint && (
        <p className="mt-[0.6rem] font-mono-accent text-[1rem] text-white/20">{hint}</p>
      )}
      {/* amber underline that grows on focus */}
      <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-amber-400/60 transition-all duration-300 group-focus-within:w-full" />
    </div>
  );
}

function CustomSelect({ options, placeholder }: { options: string[]; placeholder: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className={`${inputCls} flex items-center justify-between cursor-pointer text-left`}
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
  'w-full bg-white/[0.02] border border-white/[0.06] rounded-[12px] px-[16px] pb-[12px] pt-[12px] ' +
  'font-display text-[15px] text-white/80 placeholder:text-white/15 ' +
  'focus:outline-none focus:border-amber-400/30 focus:bg-white/[0.04] focus:shadow-[0_0_20px_rgba(245,158,11,0.05)] ' +
  'transition-all duration-300 backdrop-blur-sm';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [bgReady, setBgReady] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);

  // Defer GlitchBackground until after initial paint
  useEffect(() => {
    const id = requestIdleCallback(() => setBgReady(true), { timeout: 2000 });
    return () => cancelIdleCallback(id);
  }, []);

  return (
    <PageShell>
      {/* Glitch background — deferred load */}
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
        <div className="mx-auto max-w-[88rem] px-8 md:px-16 pt-[14rem] pb-[6rem]">
          <BlurFade delay={0.05} duration={0.5} blur="6px" offset={10}>
            <div className="flex items-center gap-3 mb-[4rem]">
              <span className="h-[1px] w-[3rem] bg-amber-400/40" />
              <span className="font-mono-accent text-[1rem] uppercase tracking-[0.18em] text-amber-400/50">
                Contact
              </span>
            </div>
          </BlurFade>

          {/* ── Hero headline ── */}
          <BlurFade delay={0.1} duration={0.7} blur="12px" offset={24}>
            <h1 className="font-display text-[clamp(4rem,9vw,9rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white/90 max-w-[16ch]">
              Let&apos;s build<br />
              <span className="text-amber-400/80">something</span><br />
              together.
            </h1>
          </BlurFade>

          <BlurFade delay={0.3} duration={0.6} blur="8px" offset={16}>
            <p className="mt-[3rem] max-w-[44rem] font-display text-[1.6rem] leading-[1.65] text-white/35 font-light">
              Deploy on-premise AI on your factory floor. Real-time safety intelligence — no cloud, no data leaving your network.
            </p>
          </BlurFade>
        </div>

        {/* ── Main grid ── */}
        <div className="mx-auto max-w-[88rem] px-8 md:px-16 pb-[12rem]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-[6rem] lg:gap-[10rem]">

            {/* Left — info */}
            <BlurFade delay={0.2} duration={0.8} blur="10px" offset={20}>
              <div className="space-y-[5rem]">
                {/* Divider */}
                <div className="h-[1px] w-full bg-white/8" />

                <div>
                  <p className="font-mono-accent text-[1rem] uppercase tracking-[0.14em] text-amber-400/40 mb-[2rem]">
                    Office
                  </p>
                  <p className="font-display text-[1.8rem] font-medium text-white/80 leading-[1.5]">
                    Kenesis Labs<br />
                    <span className="text-white/35 font-light">Chennai, Tamil Nadu</span>
                  </p>
                </div>

                <div>
                  <p className="font-mono-accent text-[1rem] uppercase tracking-[0.14em] text-amber-400/40 mb-[2rem]">
                    Email
                  </p>
                  <a
                    href="mailto:[email]"
                    className="font-display text-[1.8rem] font-medium text-white/70 hover:text-amber-400 transition-colors duration-200 cursor-pointer"
                  >
                    hello@kenesis.in
                  </a>
                </div>

                <div>
                  <p className="font-mono-accent text-[1rem] uppercase tracking-[0.14em] text-amber-400/40 mb-[2rem]">
                    Response
                  </p>
                  <p className="font-display text-[1.8rem] font-medium text-white/50 font-light">
                    Within 24 hours<br />
                    <span className="text-white/25 text-[1.4rem]">on business days</span>
                  </p>
                </div>

                {/* CIN */}
                <div className="pt-[2rem] border-t border-white/6">
                  <p className="font-mono-accent text-[1rem] text-white/15 tracking-[0.06em]">
                    CIN: U62099TN2025PTC178068
                  </p>
                </div>
              </div>
            </BlurFade>

            {/* Right — form */}
            <BlurFade delay={0.35} duration={0.8} blur="10px" offset={20}>
              {submitted ? (
                <div className="flex flex-col items-start justify-center h-full min-h-[40rem] gap-6">
                  <div className="h-[1px] w-[6rem] bg-amber-400/60" />
                  <p className="font-display text-[3.5rem] font-semibold text-white/90 leading-[1.1]">
                    Message<br />received.
                  </p>
                  <p className="font-display text-[1.5rem] text-white/35 font-light">
                    We&apos;ll be in touch within 24 hours.
                  </p>
                </div>
              ) : (
                <form
                  className="space-y-[3.5rem]"
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                >
                  {/* Name + Email side by side on large screens */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[3rem]">
                    <FloatingField label="Name">
                      <input
                        type="text"
                        placeholder="Your full name"
                        autoComplete="name"
                        required
                        className={inputCls}
                      />
                    </FloatingField>
                    <FloatingField label="Email">
                      <input
                        type="email"
                        placeholder="you@company.com"
                        autoComplete="email"
                        required
                        className={inputCls}
                      />
                    </FloatingField>
                  </div>

                  <FloatingField label="Company" hint="e.g. Tata Steel — Blast furnace plant">
                    <input
                      type="text"
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
                      placeholder="Tell us about your requirements — camera count, use cases, timeline..."
                      rows={5}
                      className={inputCls + ' resize-none'}
                    />
                  </FloatingField>

                  {/* Submit */}
                  <div className="pt-[1rem] flex items-center gap-6">
                    <button
                      type="submit"
                      className="group relative overflow-hidden rounded-full px-[3.2rem] py-[1.4rem] font-mono-accent text-[1.2rem] uppercase tracking-[0.12em] font-semibold text-[#0a0a0b] cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                        boxShadow: '0 0 40px rgba(245,158,11,0.25), 0 4px 16px rgba(245,158,11,0.2)',
                      }}
                    >
                      <span className="relative z-[1]">Request a demo</span>
                      {/* shimmer */}
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                    </button>
                    <p className="font-mono-accent text-[1rem] text-white/20">
                      No commitment required
                    </p>
                  </div>
                </form>
              )}
            </BlurFade>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
