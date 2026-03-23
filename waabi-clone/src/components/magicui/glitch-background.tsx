'use client';

import { useRef, useEffect, useState } from 'react';

interface GlitchBackgroundProps {
  customCharacters?: string;
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
  density?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function GlitchBackground({
  customCharacters = '',
  glitchColors = ['#3D5E37', '#3ADEC0', '#39DB3C'],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  density = 0.05,
  className = '',
  style,
}: GlitchBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const letters = useRef<{ char: string; color: string; targetColor: string; colorProgress: number }[]>([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const lastGlitchTime = useRef(Date.now());
  const colorsRef = useRef(glitchColors);

  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  // Keep colors ref in sync
  useEffect(() => { colorsRef.current = glitchColors; }, [glitchColors]);

  const defaultChars = '1234567890!@#$%^&*()_+|\\-={}[]:;\'"<>?,./~`';
  const lettersAndSymbols = customCharacters.trim()
    ? Array.from(new Set(customCharacters.split('').filter(c => c.trim() !== '')))
    : defaultChars.split('');

  const getRandomChar = () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
  const getRandomColor = () => colorsRef.current[Math.floor(Math.random() * colorsRef.current.length)];

  const hexToRgb = (hex: string) => {
    const short = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(short, (_m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
  };

  const interpolateColor = (start: { r: number; g: number; b: number }, end: { r: number; g: number; b: number }, factor: number) => {
    const r = Math.round(start.r + (end.r - start.r) * factor);
    const g = Math.round(start.g + (end.g - start.g) * factor);
    const b = Math.round(start.b + (end.b - start.b) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    context.current = canvas.getContext('2d');

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      context.current?.setTransform(dpr, 0, 0, dpr, 0, 0);

      const columns = Math.ceil(w / charWidth);
      const rows = Math.ceil(h / charHeight);
      grid.current = { columns, rows };
      letters.current = Array.from({ length: columns * rows }, () => ({
        char: getRandomChar(),
        color: getRandomColor(),
        targetColor: getRandomColor(),
        colorProgress: 1,
      }));
      drawLetters();
    };

    const drawLetters = () => {
      const ctx = context.current;
      if (!ctx || letters.current.length === 0) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = 'top';
      letters.current.forEach((letter, index) => {
        const x = (index % grid.current.columns) * charWidth;
        const y = Math.floor(index / grid.current.columns) * charHeight;
        ctx.fillStyle = letter.color;
        ctx.fillText(letter.char, x, y);
      });
    };

    const updateLetters = () => {
      if (letters.current.length === 0) return;
      const count = Math.max(1, Math.floor(letters.current.length * density));
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * letters.current.length);
        if (!letters.current[idx]) continue;
        letters.current[idx].char = getRandomChar();
        letters.current[idx].targetColor = getRandomColor();
        if (!smooth) {
          letters.current[idx].color = letters.current[idx].targetColor;
          letters.current[idx].colorProgress = 1;
        } else {
          letters.current[idx].colorProgress = 0;
        }
      }
    };

    const handleSmoothTransitions = () => {
      let needsRedraw = false;
      letters.current.forEach(letter => {
        if (letter.colorProgress < 1) {
          letter.colorProgress += 0.05;
          if (letter.colorProgress > 1) letter.colorProgress = 1;
          const startRgb = hexToRgb(letter.color);
          const endRgb = hexToRgb(letter.targetColor);
          if (startRgb && endRgb) {
            letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
            needsRedraw = true;
          }
        }
      });
      if (needsRedraw) drawLetters();
    };

    const animate = () => {
      const now = Date.now();
      if (now - lastGlitchTime.current >= glitchSpeed) {
        updateLetters();
        drawLetters();
        lastGlitchTime.current = now;
      }
      if (smooth) handleSmoothTransitions();
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        cancelAnimationFrame(animationRef.current);
        resizeCanvas();
        animate();
      }, 100);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [glitchSpeed, smooth, density, customCharacters]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        overflow: 'hidden',
        ...style,
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      {outerVignette && (
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)',
          }}
        />
      )}
      {centerVignette && (
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)',
          }}
        />
      )}
    </div>
  );
}
