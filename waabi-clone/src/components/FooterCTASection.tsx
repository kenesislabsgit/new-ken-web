'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';
import { AsciiDivider } from '@/components/AsciiArt';

const GLSLHills = dynamic(() => import('./GLSLHills'), { ssr: false, loading: () => null });


/* ── Data ── */

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Platform', href: '/platform' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/thekenesis/', icon: <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { label: 'Instagram', href: 'https://www.instagram.com/kenesislabs', icon: <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  { label: 'X', href: 'https://x.com/KenesisLabs', icon: <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
];

export function getLinkDelay(index: number): number {
  return 600 + index * 80;
}

/* ── Footer Component ── */

export default function FooterCTASection() {
  const footerRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-[#0a0a0b] text-white">
      {visible && <GLSLHills color="#fde047" bgColor="#0a0a0b" />}

      {/* Content */}
      <div className="relative z-10">
        {/* Top section — heading + nav + socials */}
        <div className="mx-auto max-w-[72rem] px-[2.4rem] pt-[8rem] pb-[12rem] md:px-[4.8rem]">
          <div className="grid grid-cols-1 gap-[4rem] md:grid-cols-[1fr_auto_auto]">
            {/* Left — heading + contact */}
            <div>
              <TextReveal
                variant="word-slide"
                as="h2"
                className="font-display text-[4rem] font-semibold leading-[1.05] tracking-[-0.02em] text-white/90 md:text-[5.6rem]"
              >
                We're just getting started
              </TextReveal>
              <ScrollReveal variant="fade-up" delay={0.2}>
                <p className="mt-[2rem] font-mono-accent text-[1.2rem] leading-relaxed text-white/35 tracking-[0.02em]">
                  Follow along or reach out directly at<br />
                  <a href="mailto:contact@kenesis.in" className="text-white/60 hover:text-amber-400 transition-colors underline">
                    contact@kenesis.in
                  </a>
                </p>
              </ScrollReveal>
            </div>

            {/* Center — nav links */}
            <div>
              <p className="mb-[1.6rem] font-mono-accent text-[1.1rem] font-bold uppercase tracking-[0.14em] text-white/25">
                About us
              </p>
              <nav className="flex flex-col gap-[1rem]" aria-label="Footer navigation">
                {navLinks.map((link, i) => (
                  <ScrollReveal key={link.label} variant="fade-right" delay={i * 0.08 + 0.3}>
                    <a
                      href={link.href}
                      className="text-[1.5rem] font-medium text-white/60 hover:text-amber-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </ScrollReveal>
                ))}
              </nav>
            </div>

            {/* Right — social icons */}
            <ScrollReveal variant="scale-up" delay={0.4}>
              <div className="flex gap-[1.2rem] md:self-start">
                {socialLinks.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="flex h-[4rem] w-[4rem] items-center justify-center rounded-full bg-white/10 text-white text-[1.4rem] transition-all duration-200 hover:bg-amber-500 hover:scale-105"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Brand watermark */}
        <div className="relative mx-auto max-w-[72rem] px-[2.4rem] pb-[4rem] md:px-[4.8rem]">
          <div className="flex items-end justify-end">
            <ScrollReveal variant="blur-in" duration={1.5}>
              <p className="text-right font-logo text-[clamp(5rem,12vw,10rem)] leading-none tracking-[0.06em] text-white/[0.06] select-none uppercase">
                kenesis
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 px-[2.4rem] py-[2rem] md:px-[4.8rem]">
          <div className="mx-auto max-w-[72rem] mb-2">
            <AsciiDivider accent="◈" className="text-white/[0.04]" />
          </div>
          <div className="mx-auto flex max-w-[72rem] flex-col items-center justify-between gap-[1rem] md:flex-row">
            <p className="font-mono-accent text-[1.1rem] text-white/25 tracking-[0.04em]">
              &copy; 2026 Kenesis Labs Pvt. Ltd. All Rights Reserved. Chennai, India.
            </p>
            <a href="/privacy-policy" className="font-mono-accent text-[1.1rem] font-medium text-white/35 underline hover:text-white transition-colors tracking-[0.04em]">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}