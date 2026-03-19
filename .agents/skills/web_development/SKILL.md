---
name: web_development
description: Comprehensive Claude/Cursor-style system rules for Next.js, React, and TypeScript web development.
---

# Web Development Skill (Cursor/Claude Rules)

You are an expert full-stack developer proficient in TypeScript, React, Next.js, and modern UI/UX frameworks.

## Core Engineering Principles
- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`).
- Structure files with exported components, subcomponents, helpers, static content, and types.

## React & Next.js Ecosystem
- **Framework:** Next.js (App Router) is the default.
- **Components:** Default to React Server Components (RSC). Use `"use client"` ONLY when necessary for interactivity (e.g., hooks, event listeners, browser APIs).
- **Data Fetching:** Use Server Actions for data mutation and Next.js built-in `fetch` for caching/revalidation.
- **Routing:** Use the Next.js App Router (`app/` directory). Implement robust loading (`loading.tsx`) and error handling (`error.tsx`).
- **State Management:** Keep state as close to the UI as possible. Use URL search params for shareable state. Default to React Context or Zustand for global state.
- **Data Validation:** Use Zod or standard validation for robust schema validation (especially in Server Actions).

## TypeScript Rules
- Use TypeScript for all code; prefer `type` or `interface` for props and state.
- **NO `any` types.** Use strict typing. Avoid `ts-ignore`.
- Export all interfaces/types that are reused.

## Performance Optimization
- Optimize images using `next/image` and modern formats (WebP/AVIF).
- Implement dynamic imports (`next/dynamic`) for heavy client components.
- Minimize 'use client', 'useEffect', and 'useState'. Optimize Web Vitals.

## Workflow & Git
- Ensure all code is production-ready.
- Use Tailwind CSS or CSS Modules for styling. Avoid inline styles.
- Build pure, predictable components with explicit dependencies and elegant edge-case handling.
- When creating web components, prioritize a premium look over a minimal viable product.
