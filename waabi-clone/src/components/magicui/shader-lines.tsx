"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/animations";

interface ShaderLinesProps {
  className?: string;
  /** Line color — hex */
  color?: string;
  /** Background color — hex */
  bgColor?: string;
  /** Animation speed multiplier */
  speed?: number;
  /** Line density (higher = more lines) */
  density?: number;
  /** Glow intensity 0-1 */
  intensity?: number;
}

// Parse hex to [r,g,b] normalized 0-1
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

const FRAG = `precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color;
uniform vec3 u_bg;
uniform float u_density;
uniform float u_intensity;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;

  float lines = 0.0;
  for (float i = 0.0; i < 6.0; i++) {
    float freq = u_density * (1.0 + i * 0.7);
    float amp = 0.03 / (1.0 + i * 0.4);
    float phase = u_time * (0.3 + i * 0.15) + i * 1.7;
    float wave = sin(uv.x * freq + phase) * amp;
    float y = 0.15 + i * 0.13 + wave;
    float dist = abs(uv.y - y);
    float line = smoothstep(0.008, 0.0, dist) * (0.5 + 0.5 * sin(uv.x * 2.0 + u_time + i));
    lines += line;
  }

  lines *= u_intensity;
  vec3 col = mix(u_bg, u_color, clamp(lines, 0.0, 1.0));
  // Add subtle glow
  col += u_color * lines * 0.3;
  gl_FragColor = vec4(col, 1.0);
}`;

export function ShaderLines({
  className,
  color = "#f59e0b",
  bgColor = "#0a0a0b",
  speed = 1,
  density = 8,
  intensity = 0.6,
}: ShaderLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;

    // Compile shader
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uColor = gl.getUniformLocation(prog, "u_color");
    const uBg = gl.getUniformLocation(prog, "u_bg");
    const uDensity = gl.getUniformLocation(prog, "u_density");
    const uIntensity = gl.getUniformLocation(prog, "u_intensity");

    const [cr, cg, cb] = hexToGL(color);
    const [br, bg2, bb] = hexToGL(bgColor);
    gl.uniform3f(uColor, cr, cg, cb);
    gl.uniform3f(uBg, br, bg2, bb);
    gl.uniform1f(uDensity, density);
    gl.uniform1f(uIntensity, intensity);

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

    const start = performance.now();
    function render() {
      resize();
      const t = ((performance.now() - start) / 1000) * speed;
      gl!.uniform1f(uTime, t);
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
  }, [color, bgColor, speed, density, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full", className)}
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}
