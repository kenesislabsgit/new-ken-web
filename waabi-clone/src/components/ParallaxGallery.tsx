'use client';

import { useEffect, useRef } from 'react';
import { bindParallax, cleanupScrollTrigger } from '@/lib/animations';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GalleryPanel {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  alt?: string;
}

const panels: GalleryPanel[] = [
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=2000&q=80',
    alt: 'Mountain landscape at sunrise',
  },
  {
    type: 'video',
    src: 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4',
    poster: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=2000&q=80',
    alt: 'Aerial nature footage',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=2000&q=80',
    alt: 'Misty forest valley',
  },
  {
    type: 'video',
    src: 'https://videos.pexels.com/video-files/5532771/5532771-uhd_2560_1440_25fps.mp4',
    poster: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=2000&q=80',
    alt: 'Cinematic landscape',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=2000&q=80',
    alt: 'Golden hour over rolling hills',
  },
];

export default function ParallaxGallery() {
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const parallaxTriggers: (ScrollTrigger | null)[] = [];
    const scaleTweens: gsap.core.Tween[] = [];

    panels.forEach((_, i) => {
      const mediaEl = mediaRefs.current[i];
      const panelEl = panelRefs.current[i];

      // bindParallax for vertical parallax movement
      const st = bindParallax(mediaEl, { factor: 0.4 });
      parallaxTriggers.push(st);

      // ScrollTrigger scrub: scale 1.0 → 1.04 on enter
      if (panelEl && mediaEl) {
        const tween = gsap.fromTo(
          mediaEl,
          { scale: 1 },
          {
            scale: 1.04,
            ease: 'none',
            scrollTrigger: {
              trigger: panelEl,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            },
          },
        );
        scaleTweens.push(tween);
      }
    });

    return () => {
      parallaxTriggers.forEach((st) => cleanupScrollTrigger(st));
      scaleTweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <section>
      {panels.map((panel, i) => (
        <div
          key={i}
          ref={(el) => { panelRefs.current[i] = el; }}
          className="relative h-screen w-full overflow-hidden"
        >
          <div
            ref={(el) => { mediaRefs.current[i] = el; }}
            className="absolute inset-x-0 top-0 w-full"
            style={{ height: '130vh' }}
          >
            {panel.type === 'video' ? (
              <video
                autoPlay
                playsInline
                loop
                muted
                poster={panel.poster}
                className="h-full w-full object-cover"
                aria-label={panel.alt}
              >
                <source src={panel.src} type="video/mp4" />
              </video>
            ) : (
              <img
                src={panel.src}
                alt={panel.alt ?? ''}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
