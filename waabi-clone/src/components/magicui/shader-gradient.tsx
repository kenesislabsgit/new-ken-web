"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/animations";

interface ShaderGradientProps {
  className?: string;
  /** First accent color — hex */
  colorA?: string;
  /** Second accent color — hex */
  colorB?: string;
  /** Background color — hex */
  bgColor?: string;
  /** Animation speed (0.01–0.2) */
  speed?: number;
  /** Color intensity multiplier (0.1–3) */
  intensity?: number;
  /** Number of vertical bars */
  barCount?: number;
}

function hexToGL(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

const VERT = `attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;

const FRAG = `
#define PI 3.14159265359
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_barCount;
uniform float u_intensity;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform vec3 u_bg;

// Hash functions
float hash(float n) { return fract(sin(n) * 43758.5453123); }
float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;

  // Centered coordinates
  vec2 cuv = uv - 0.5;
  cuv.x *= aspect;

  // --- Dense vertical bars ---
  float barFreq = u_barCount;
  float barX = uv.x * barFreq;
  float barId = floor(barX);
  float barFrac = fract(barX);

  // Each bar has a slightly different phase and brightness
  float barPhase = hash(barId * 1.731);
  float barSpeed = 0.3 + barPhase * 0.7;

  // Bar edge sharpness — thin bright lines between bars
  float barEdge = smoothstep(0.0, 0.08, barFrac) * smoothstep(1.0, 0.92, barFrac);

  // Animated brightness per bar — pulsing at different rates
  float pulse1 = sin(u_time * barSpeed * 0.8 + barPhase * PI * 2.0) * 0.5 + 0.5;
  float pulse2 = sin(u_time * barSpeed * 1.3 + barPhase * 12.0) * 0.5 + 0.5;
  float barBrightness = mix(0.15, 1.0, pulse1 * pulse2);

  // --- Central glow hotspot (diamond/circular shape) ---
  float dist = length(cuv * vec2(1.0, 1.4));
  float centralGlow = exp(-dist * dist * 6.0);

  // Secondary glow spots that move
  float glow2 = exp(-pow(length(cuv - vec2(sin(u_time * 0.2) * 0.3, cos(u_time * 0.15) * 0.15)), 2.0) * 8.0);
  float glow3 = exp(-pow(length(cuv - vec2(cos(u_time * 0.25) * 0.25, sin(u_time * 0.3) * 0.2)), 2.0) * 10.0);

  float totalGlow = centralGlow * 0.7 + glow2 * 0.2 + glow3 * 0.15;

  // --- Combine: bars modulated by glow ---
  float barLight = barEdge * barBrightness;

  // Bright bars near glow center, dim bars at edges
  float combined = barLight * (0.12 + totalGlow * 0.88);

  // Add bright hotspot bleeding through bars
  combined += totalGlow * 0.4;

  // Vertical gradient falloff at top/bottom
  float vFade = smoothstep(0.0, 0.25, uv.y) * smoothstep(1.0, 0.75, uv.y);
  combined *= vFade;

  combined *= u_intensity;

  // Color: blend A and B across horizontal position + time
  float colorMix = 0.5 + 0.5 * sin(uv.x * PI * 2.0 + u_time * 0.3);
  vec3 lineColor = mix(u_colorA, u_colorB, colorMix);

  // Final: background + colored light
  vec3 finalColor = u_bg + combined * lineColor;

  gl_FragColor = vec4(finalColor, 1.0);
}`;

export function ShaderGradient({
  className,
  colorA = "#f59e0b",
  colorB = "#d97706",
  bgColor = "#0a0a0b",
  speed = 0.05,
  intensity = 1.5,
  barCount = 80,
}: ShaderGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Fullscreen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uBarCount = gl.getUniformLocation(prog, "u_barCount");
    const uIntensity = gl.getUniformLocation(prog, "u_intensity");
    const uColorA = gl.getUniformLocation(prog, "u_colorA");
    const uColorB = gl.getUniformLocation(prog, "u_colorB");
    const uBg = gl.getUniformLocation(prog, "u_bg");

    const [ar, ag, ab] = hexToGL(colorA);
    const [br, bg2, bb] = hexToGL(colorB);
    const [bgr, bgg, bgb] = hexToGL(bgColor);

    gl.uniform3f(uColorA, ar, ag, ab);
    gl.uniform3f(uColorB, br, bg2, bb);
    gl.uniform3f(uBg, bgr, bgg, bgb);
    gl.uniform1f(uIntensity, intensity);
    gl.uniform1f(uBarCount, barCount);

    let timeVal = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = canvas!.clientWidth * dpr;
      const h = canvas!.clientHeight * dpr;
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
        gl!.uniform2f(uRes, w, h);
      }
    }

    function render() {
      resize();
      timeVal += speed;
      gl!.uniform1f(uTime, timeVal);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [colorA, colorB, bgColor, speed, intensity, barCount]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full", className)}
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}
