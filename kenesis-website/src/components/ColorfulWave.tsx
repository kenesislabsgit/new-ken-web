'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Premium curved light stream — like a long-exposure photograph of light
 * sweeping in a wide arc from bottom-left to upper-right.
 * Multiple parallel light trails within a thick band, warm amber/gold tones.
 * Subtle cursor interaction bends the flow gently.
 * Raw WebGL — no Three.js dependency.
 */

interface ColorfulWaveProps {
  className?: string;
  bgColor?: string;
}

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

/*
 * Volumetric light ribbon — the dominant visual is a MASSIVE soft glow
 * like light through fog/mist. Only a few bright accent streaks inside.
 * The glow IS the main element, not the lines.
 */

vec2 bezierPoint(vec2 A, vec2 B, vec2 C, float t) {
  float s = 1.0 - t;
  return s * s * A + 2.0 * s * t * B + t * t * C;
}

float closestBezierT(vec2 p, vec2 A, vec2 B, vec2 C) {
  float bestT = 0.0;
  float bestD = 1e10;
  for (float i = 0.0; i <= 24.0; i += 1.0) {
    float t = i / 24.0;
    vec2 bp = bezierPoint(A, B, C, t);
    float d = length(p - bp);
    if (d < bestD) { bestD = d; bestT = t; }
  }
  float lo = max(bestT - 0.042, 0.0);
  float hi = min(bestT + 0.042, 1.0);
  for (float i = 0.0; i <= 16.0; i += 1.0) {
    float t = lo + (hi - lo) * i / 16.0;
    vec2 bp = bezierPoint(A, B, C, t);
    float d = length(p - bp);
    if (d < bestD) { bestD = d; bestT = t; }
  }
  return bestT;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  // Magnetic cursor — pulls light toward mouse position
  vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0);
  float mDist = length(p - m);
  vec2 mPull = (m - p) * smoothstep(0.55, 0.0, mDist) * 0.08;
  vec2 dp = p + mPull;

  // Main bezier spine — wide arc from bottom-left to upper-right
  float drift = sin(u_time * 0.12) * 0.025;
  vec2 A = vec2(-0.95 * aspect, -0.52 + drift);
  vec2 B = vec2(-0.1, 0.0 + drift * 1.5);
  vec2 C = vec2(0.3, 0.7 + drift * 0.8);

  // Secondary spine — lower, dimmer
  vec2 A2 = vec2(-0.7 * aspect, -0.62 + drift * 0.5);
  vec2 B2 = vec2(0.05, -0.32 + drift);
  vec2 C2 = vec2(0.85 * aspect, -0.1 + drift * 0.6);

  // === Main band ===
  float t1 = closestBezierT(dp, A, B, C);
  vec2 closest1 = bezierPoint(A, B, C, t1);
  float dist1 = length(dp - closest1);

  float eps = 0.001;
  vec2 tang1 = normalize(bezierPoint(A, B, C, min(t1+eps,1.0)) - bezierPoint(A, B, C, max(t1-eps,0.0)));
  vec2 norm1 = vec2(-tang1.y, tang1.x);
  float sd1 = dot(dp - closest1, norm1);

  float endFade1 = smoothstep(0.0, 0.15, t1) * smoothstep(1.0, 0.82, t1);

  // === Secondary band ===
  float t2 = closestBezierT(dp, A2, B2, C2);
  vec2 closest2 = bezierPoint(A2, B2, C2, t2);
  float dist2 = length(dp - closest2);

  vec2 tang2 = normalize(bezierPoint(A2, B2, C2, min(t2+eps,1.0)) - bezierPoint(A2, B2, C2, max(t2-eps,0.0)));
  vec2 norm2 = vec2(-tang2.y, tang2.x);
  float sd2 = dot(dp - closest2, norm2);

  float endFade2 = smoothstep(0.0, 0.15, t2) * smoothstep(1.0, 0.82, t2);

  vec3 col = vec3(0.0);

  // ============================================================
  // LAYER 1: Massive volumetric glow (the dominant visual)
  // This is the huge soft amber wash that fills the screen
  // ============================================================

  // Gaussian-like falloff using multiple smoothstep layers
  // Each layer is wider and dimmer, creating a smooth gradient

  // Inner glow — bright, warm white-gold
  float g1 = smoothstep(0.15, 0.0, dist1) * 0.55;
  col += vec3(1.0, 0.88, 0.45) * g1 * endFade1;

  // Mid glow — amber
  float g2 = smoothstep(0.3, 0.0, dist1) * 0.3;
  col += vec3(0.85, 0.6, 0.1) * g2 * endFade1;

  // Wide glow — deep amber, fills large area
  float g3 = smoothstep(0.55, 0.0, dist1) * 0.15;
  col += vec3(0.6, 0.38, 0.04) * g3 * endFade1;

  // Ultra-wide atmospheric wash — tints the whole region
  float g4 = smoothstep(0.9, 0.0, dist1) * 0.06;
  col += vec3(0.35, 0.22, 0.02) * g4 * endFade1;

  // ============================================================
  // LAYER 2: A few bright accent streaks inside the glow
  // Only 4 lines — they sit inside the volumetric glow
  // ============================================================

  for (float i = 0.0; i < 4.0; i += 1.0) {
    float offset = (i - 1.5) * 0.018;
    float phase = u_time * (0.06 + i * 0.02) + i * 1.7;
    float wobble = sin(t1 * 5.0 + phase) * 0.005;

    float td = abs(sd1 - offset - wobble);

    // Thin bright core
    float core = smoothstep(0.004, 0.0, td) * 0.8;
    // Soft halo around each streak
    float halo = smoothstep(0.025, 0.0, td) * 0.2;

    float intensity = (core + halo) * endFade1;

    // Center streaks are brighter white, outer ones more amber
    vec3 streakCol;
    if (i < 1.0 || i > 2.5) {
      streakCol = vec3(1.0, 0.82, 0.3);
    } else {
      streakCol = vec3(1.0, 0.95, 0.7); // near-white
    }

    col += streakCol * intensity;
  }

  // ============================================================
  // LAYER 3: Secondary band — softer, dimmer volumetric glow
  // ============================================================

  // Volumetric glow for secondary band
  float sg1 = smoothstep(0.1, 0.0, dist2) * 0.2;
  col += vec3(0.9, 0.65, 0.15) * sg1 * endFade2;

  float sg2 = smoothstep(0.25, 0.0, dist2) * 0.1;
  col += vec3(0.6, 0.4, 0.06) * sg2 * endFade2;

  float sg3 = smoothstep(0.5, 0.0, dist2) * 0.04;
  col += vec3(0.35, 0.2, 0.02) * sg3 * endFade2;

  // A couple of accent streaks in secondary band
  for (float i = 0.0; i < 2.0; i += 1.0) {
    float offset = (i - 0.5) * 0.014;
    float phase = u_time * (0.05 + i * 0.015) + i * 2.3;
    float wobble = sin(t2 * 4.0 + phase) * 0.004;
    float td = abs(sd2 - offset - wobble);

    float core = smoothstep(0.003, 0.0, td) * 0.5;
    float halo = smoothstep(0.018, 0.0, td) * 0.15;

    col += vec3(0.95, 0.75, 0.25) * (core + halo) * endFade2;
  }

  // Clamp gently
  col = min(col, vec3(1.3));

  gl_FragColor = vec4(col, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ColorfulWave({
  className = '',
  bgColor = '#000000',
}: ColorfulWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let vs: WebGLShader | null = null;
    let fs: WebGLShader | null = null;
    let posBuffer: WebGLBuffer | null = null;
    let rafId = 0;

    try {
      gl = canvas.getContext('webgl', { antialias: true, alpha: false });
      if (!gl) { setFailed(true); return; }

      vs = createShader(gl, gl.VERTEX_SHADER, VERT);
      fs = createShader(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) { setFailed(true); return; }

      program = gl.createProgram();
      if (!program) { setFailed(true); return; }
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('Program link error:', gl.getProgramInfoLog(program));
        setFailed(true);
        return;
      }

      gl.useProgram(program);

      // Fullscreen quad
      posBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      // Uniforms
      const uTime = gl.getUniformLocation(program, 'u_time');
      const uRes = gl.getUniformLocation(program, 'u_resolution');
      const uMouse = gl.getUniformLocation(program, 'u_mouse');

      const resize = () => {
        const container = canvas.parentElement;
        if (!container || !gl) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        const dpr = Math.min(window.devicePixelRatio, 2);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        gl.viewport(0, 0, canvas.width, canvas.height);
      };

      const onMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = (e.clientX - rect.left) / rect.width;
        mouseRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height;
      };

      window.addEventListener('resize', resize);
      canvas.addEventListener('mousemove', onMouseMove);
      resize();

      const startTime = performance.now();
      const glRef = gl;

      const render = () => {
        try {
          const t = (performance.now() - startTime) / 1000;
          // Smooth mouse interpolation
          smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * 0.03;
          smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * 0.03;
          glRef.uniform1f(uTime, t);
          glRef.uniform2f(uRes, canvas.width, canvas.height);
          glRef.uniform2f(uMouse, smoothMouse.current.x, smoothMouse.current.y);
          glRef.drawArrays(glRef.TRIANGLE_STRIP, 0, 4);
        } catch {
          // Silently fail on render errors
        }
        rafId = requestAnimationFrame(render);
      };

      rafId = requestAnimationFrame(render);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('mousemove', onMouseMove);
        if (gl) {
          if (program) gl.deleteProgram(program);
          if (vs) gl.deleteShader(vs);
          if (fs) gl.deleteShader(fs);
          if (posBuffer) gl.deleteBuffer(posBuffer);
        }
      };
    } catch (err) {
      console.warn('[ColorfulWave] WebGL init failed:', err);
      setFailed(true);
      return () => { cancelAnimationFrame(rafId); };
    }
  }, []);

  if (failed) {
    return <div className={className} style={{ backgroundColor: bgColor }} aria-hidden="true" />;
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', backgroundColor: bgColor }}
      aria-hidden="true"
    />
  );
}
