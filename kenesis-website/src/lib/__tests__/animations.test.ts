import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import gsap from 'gsap';
import {
  prefersReducedMotion,
  fadeUp,
  clipReveal,
  bindParallax,
  staggerChildren,
  _resetReducedMotionCache,
} from '../animations';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Mock gsap
vi.mock('gsap', async () => {
  const actual = await vi.importActual<typeof import('gsap')>('gsap');
  return {
    ...actual,
    default: {
      ...actual.default,
      fromTo: vi.fn(() => ({ kill: vi.fn() })),
      set: vi.fn(),
      registerPlugin: vi.fn(),
    },
  };
});

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(() => ({ kill: vi.fn() })),
    killAll: vi.fn(),
  },
}));

function mockMatchMedia(reducedMotion: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reducedMotion,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

beforeEach(() => {
  _resetReducedMotionCache();
  mockMatchMedia(false);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('prefersReducedMotion', () => {
  it('returns a boolean', () => {
    const result = prefersReducedMotion();
    expect(typeof result).toBe('boolean');
  });

  it('returns false when prefers-reduced-motion is not set', () => {
    expect(prefersReducedMotion()).toBe(false);
  });

  it('returns true when prefers-reduced-motion: reduce is active', () => {
    _resetReducedMotionCache();
    mockMatchMedia(true);
    expect(prefersReducedMotion()).toBe(true);
  });
});

describe('fadeUp', () => {
  it('handles null element gracefully and returns null', () => {
    const result = fadeUp(null);
    expect(result).toBeNull();
    expect(gsap.fromTo).not.toHaveBeenCalled();
  });

  it('sets final state immediately when reduced motion is active', () => {
    _resetReducedMotionCache();
    mockMatchMedia(true);

    const el = document.createElement('div');
    const result = fadeUp(el);

    expect(result).toBeNull();
    expect(gsap.fromTo).not.toHaveBeenCalled();
    expect(gsap.set).toHaveBeenCalledWith(el, {
      opacity: 1,
      y: 0,
      clearProps: 'willChange',
    });
  });
});

describe('clipReveal', () => {
  it('handles null element gracefully and returns null', () => {
    const result = clipReveal(null);
    expect(result).toBeNull();
    expect(gsap.fromTo).not.toHaveBeenCalled();
  });

  it('sets final state immediately when reduced motion is active', () => {
    _resetReducedMotionCache();
    mockMatchMedia(true);

    const el = document.createElement('div');
    const result = clipReveal(el);

    expect(result).toBeNull();
    expect(gsap.fromTo).not.toHaveBeenCalled();
    expect(gsap.set).toHaveBeenCalledWith(el, {
      yPercent: 0,
      clearProps: 'willChange',
    });
  });
});

describe('bindParallax', () => {
  it('handles null element gracefully and returns null', () => {
    const result = bindParallax(null);
    expect(result).toBeNull();
    expect(ScrollTrigger.create).not.toHaveBeenCalled();
  });

  it('returns null (no-op) when reduced motion is active', () => {
    _resetReducedMotionCache();
    mockMatchMedia(true);

    const parent = document.createElement('div');
    const el = document.createElement('div');
    parent.appendChild(el);

    const result = bindParallax(el);
    expect(result).toBeNull();
    expect(ScrollTrigger.create).not.toHaveBeenCalled();
  });
});

describe('staggerChildren', () => {
  it('handles null container gracefully and returns empty array', () => {
    const result = staggerChildren(null);
    expect(result).toEqual([]);
    expect(gsap.fromTo).not.toHaveBeenCalled();
  });
});
