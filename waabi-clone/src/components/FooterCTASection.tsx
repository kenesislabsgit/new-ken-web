'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Linkedin, Instagram, Twitter } from 'lucide-react';
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
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/thekenesis/', icon: <Linkedin size={20} /> },
  { label: 'Instagram', href: 'https://www.instagram.com/kenesislabs', icon: <Instagram size={20} /> },
  { label: 'X', href: 'https://x.com/KenesisLabs', icon: <Twitter size={20} /> },
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