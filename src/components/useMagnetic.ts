'use client';

import type { PointerEvent } from 'react';
import { useReducedMotion, useSpring } from 'motion/react';

// Magnetic pull for CTAs and carousel arrows (PROJ-129): while a fine mouse
// is over the element, it drifts up to MAX_PULL_PX toward the cursor on a
// spring, and springs back on leave. Spread the result onto a motion element:
// <motion.button {...useMagnetic()} />. The x/y transform composes with the
// CSS `translate` and `scale` properties Tailwind uses (-translate-y-1/2,
// the `press` utility), so positioning and the press still work.
const MAX_PULL_PX = 4;
const PULL = 0.2;
const SPRING = { stiffness: 300, damping: 20, mass: 0.5 };

const clamp = (v: number) => Math.max(-MAX_PULL_PX, Math.min(MAX_PULL_PX, v));

export function useMagnetic<T extends HTMLElement>() {
  const reduce = useReducedMotion();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  const onPointerMove = (e: PointerEvent<T>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    // The rect already includes the current pull; take it out to get the
    // resting center.
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - x.get();
    const cy = rect.top + rect.height / 2 - y.get();
    x.set(clamp((e.clientX - cx) * PULL));
    y.set(clamp((e.clientY - cy) * PULL));
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { style: { x, y }, onPointerMove, onPointerLeave };
}
