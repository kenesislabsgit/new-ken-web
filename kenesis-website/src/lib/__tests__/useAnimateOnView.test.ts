import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnimateOnView } from '../useAnimateOnView';
import type { RefObject } from 'react';

let mockObserve: ReturnType<typeof vi.fn>;
let mockUnobserve: ReturnType<typeof vi.fn>;
let mockDisconnect: ReturnType<typeof vi.fn>;
let capturedCallback: IntersectionObserverCallback;
let capturedOptions: IntersectionObserverInit | undefined;

beforeEach(() => {
  mockObserve = vi.fn();
  mockUnobserve = vi.fn();
  mockDisconnect = vi.fn();

  // Use a proper constructor function so `new IntersectionObserver(...)` works
  const MockIO = function (
    this: IntersectionObserver,
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    capturedCallback = callback;
    capturedOptions = options;
    this.observe = mockObserve;
    this.unobserve = mockUnobserve;
    this.disconnect = mockDisconnect;
    this.root = null;
    this.rootMargin = '';
    this.thresholds = [];
    this.takeRecords = () => [];
  } as unknown as typeof IntersectionObserver;

  globalThis.IntersectionObserver = MockIO;
});

afterEach(() => {
  vi.restoreAllMocks();
});

function createRef(el: Element | null): RefObject<Element> {
  return { current: el } as RefObject<Element>;
}

describe('useAnimateOnView', () => {
  it('creates IntersectionObserver with default threshold of 0.15', () => {
    const el = document.createElement('div');
    const ref = createRef(el);

    renderHook(() => useAnimateOnView(ref));

    expect(capturedOptions?.threshold).toBe(0.15);
    expect(mockObserve).toHaveBeenCalledWith(el);
  });

  it('isInView starts as false', () => {
    const el = document.createElement('div');
    const ref = createRef(el);

    const { result } = renderHook(() => useAnimateOnView(ref));

    expect(result.current.isInView).toBe(false);
  });

  it('fires callback and sets isInView to true when element enters viewport', () => {
    const el = document.createElement('div');
    const ref = createRef(el);
    const onEnter = vi.fn();

    const { result } = renderHook(() =>
      useAnimateOnView(ref, { onEnter }),
    );

    // Simulate intersection
    act(() => {
      capturedCallback(
        [
          {
            isIntersecting: true,
            target: el,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRatio: 0.5,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            time: 0,
          },
        ],
        {} as IntersectionObserver,
      );
    });

    expect(result.current.isInView).toBe(true);
    expect(onEnter).toHaveBeenCalledWith(el);
  });

  it('falls back to isInView=true when IntersectionObserver is not supported', () => {
    // Remove IntersectionObserver from window
    const saved = globalThis.IntersectionObserver;
    // @ts-expect-error - intentionally removing for test
    delete globalThis.IntersectionObserver;

    const el = document.createElement('div');
    const ref = createRef(el);

    const { result } = renderHook(() => useAnimateOnView(ref));

    expect(result.current.isInView).toBe(true);

    // Restore
    globalThis.IntersectionObserver = saved;
  });
});
