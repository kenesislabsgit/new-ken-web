'use client';

import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';

export default function SplitContentSection() {
  return (
    <section className="py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:px-12">
        {/* Left column: text */}
        <ScrollReveal variant="fade-left" duration={1}>
          <div>
            <TextReveal
              variant="word-blur"
              as="h2"
              className="mb-6 font-display text-4xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-5xl"
            >
              Driving the future of autonomous mobility
            </TextReveal>
            <ScrollReveal variant="fade-up" delay={0.2}>
              <p className="text-lg leading-relaxed text-neutral-600">
                Our platform combines cutting-edge AI with rigorous safety standards
                to deliver autonomous driving solutions that scale. From simulation
                to real-world deployment, every mile is backed by data-driven
                confidence.
              </p>
            </ScrollReveal>
          </div>
        </ScrollReveal>

        {/* Right column: image */}
        <ScrollReveal variant="clip-left" duration={1.2}>
          <div className="overflow-hidden rounded-2xl">
            <img
              src="/images/split/1.png"
              alt="Autonomous vehicle technology"
              className="h-full w-full object-cover"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}