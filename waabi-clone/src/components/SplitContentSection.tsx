'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/animations';
import { useAnimateOnView } from '@/lib/useAnimateOnView';
import gsap from 'gsap';

export default function SplitContentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const { isInView } = useAnimateOnView(sectionRef as React.RefObject<Element>, {
    threshold: 0.15,
  });

  useEffect(() => {
    if (!isInView) return;

    const tweens: gsap.core.Tween[] = [];

    if (prefersReducedMotion()) {
      gsap.set(textRef.current, { opacity: 1, x: 0, clearProps: 'willChange' });
      gsap.set(imageRef.current, { opacity: 1, x: 0, clearProps: 'willChange' });
      return;
    }

    // Text: translateX(-60px→0), opacity 0→1, 0.9s
    if (textRef.current) {
      (textRef.current as HTMLElement).style.willChange = 'transform';
      tweens.push(
        gsap.fromTo(
          textRef.current,
          { opacity: 0, x: -60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: 'expo.out',
            onComplete() {
              if (textRef.current) {
                (textRef.current as HTMLElement).style.willChange = 'auto';
              }
            },
          },
        ),
      );
    }

    // Image: translateX(60px→0), opacity 0→1, 0.9s simultaneously
    if (imageRef.current) {
      (imageRef.current as HTMLElement).style.willChange = 'transform';
      tweens.push(
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, x: 60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: 'expo.out',
            onComplete() {
              if (imageRef.current) {
                (imageRef.current as HTMLElement).style.willChange = 'auto';
              }
            },
          },
        ),
      );
    }

    return () => {
      tweens.forEach((t) => t.kill());
      if (textRef.current) {
        (textRef.current as HTMLElement).style.willChange = 'auto';
      }
      if (imageRef.current) {
        (imageRef.current as HTMLElement).style.willChange = 'auto';
      }
    };
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className="py-32"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:px-12">
        {/* Left column: text */}
        <div
          ref={textRef}
          style={{ opacity: 0, transform: 'translateX(-60px)' }}
        >
          <h2 className="mb-6 font-display text-4xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-5xl">
            Driving the future of autonomous mobility
          </h2>
          <p className="text-lg leading-relaxed text-neutral-600">
            Our platform combines cutting-edge AI with rigorous safety standards
            to deliver autonomous driving solutions that scale. From simulation
            to real-world deployment, every mile is backed by data-driven
            confidence.
          </p>
        </div>

        {/* Right column: image */}
        <div
          ref={imageRef}
          className="overflow-hidden rounded-2xl"
          style={{ opacity: 0, transform: 'translateX(60px)' }}
        >
          <img
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=1200&q=80"
            alt="Autonomous vehicle technology"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
