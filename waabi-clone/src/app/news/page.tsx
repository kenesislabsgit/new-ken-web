'use client';

import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';

const articles = [
  { slug: 'edge-ai-platform-launch', title: 'Kenesis Labs launches edge AI platform for Indian manufacturing safety', date: 'January 15, 2026', tag: 'Company News' },
  { slug: 'yolov8-qwen-contextual-alerts', title: 'How YOLOv8 + Qwen2.5-VL delivers contextual safety alerts on-premise', date: 'December 10, 2025', tag: 'Technology' },
  { slug: 'cloud-vs-edge-indian-factories', title: 'Why cloud-based CCTV analytics fail Indian factories — and what works instead', date: 'November 20, 2025', tag: 'Industry' },
  { slug: 'ppe-compliance-intelligence', title: 'PPE compliance monitoring: From bounding boxes to actionable intelligence', date: 'October 15, 2025', tag: 'Technology' },
  { slug: 'mac-mini-30-cameras', title: 'Running 30 cameras on a Mac Mini M4 Pro: Our edge inference benchmark', date: 'September 28, 2025', tag: 'Benchmark' },
  { slug: 'data-sovereignty-manufacturing', title: 'Data sovereignty in Indian manufacturing: Why on-premise AI matters', date: 'August 18, 2025', tag: 'Industry' },
  { slug: 'kenesis-labs-incorporated', title: 'Kenesis Labs incorporated in Chennai, Tamil Nadu', date: 'July 2025', tag: 'Company News' },
];

export default function NewsPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-[72rem] px-6 pb-16 md:px-12">
        <BlurFade delay={0.1} duration={0.6} blur="8px" offset={16}>
          <p className="font-mono-accent text-[1.1rem] uppercase tracking-[0.14em] text-amber-400/60 mb-8">Newsroom</p>
        </BlurFade>
        <BlurFade delay={0.2} duration={0.7} blur="10px" offset={20}>
          <h1 className="font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-white/90">
            Latest News
          </h1>
        </BlurFade>
      </section>

      <section className="mx-auto max-w-[72rem] px-6 pb-24 md:px-12">
        <div className="divide-y divide-white/[0.06]">
          {articles.map((a, i) => (
            <ScrollReveal key={a.slug} variant="fade-left" delay={i * 0.06}>
              <a href={`/news/${a.slug}`} className="group flex items-start gap-8 py-8 cursor-pointer">
                <div className="hidden md:block w-[200px] flex-shrink-0 aspect-[16/10] rounded-xl bg-white/[0.04] overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-br from-white/[0.02] to-white/[0.06] group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono-accent rounded-full bg-white/[0.08] px-3 py-1 text-[1rem] text-white/45 uppercase tracking-[0.08em]">{a.tag}</span>
                    <span className="font-mono-accent text-[1rem] text-white/25 tracking-[0.04em]">{a.date}</span>
                  </div>
                  <h2 className="font-display text-[1.8rem] font-semibold leading-[1.3] text-white/85 group-hover:text-amber-400 transition-colors">{a.title}</h2>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
