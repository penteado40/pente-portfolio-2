'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react';

const SIZE = 200;
const BLUR = 30;
const SPRING = { stiffness: 120, damping: 22 };
const ACCENT = '#e8743b';

const noop = () => () => {};
const getFinePointer = () => window.matchMedia('(pointer: fine)').matches;
const getFinePointerServer = () => false;

export function CursorGlow() {
  const reduce = useReducedMotion();
  const hasFinePointer = useSyncExternalStore(
    noop,
    getFinePointer,
    getFinePointerServer
  );
  const [active, setActive] = useState(false);
  const shownRef = useRef(false);

  const rawX = useMotionValue(-SIZE / 2);
  const rawY = useMotionValue(-SIZE / 2);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  useEffect(() => {
    if (!hasFinePointer) return;

    function handleMove(e: MouseEvent) {
      rawX.set(e.clientX - SIZE / 2);
      rawY.set(e.clientY - SIZE / 2);

      if (!shownRef.current) {
        shownRef.current = true;
        setActive(true);
      }
    }

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [hasFinePointer, rawX, rawY]);

  if (reduce || !hasFinePointer) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        x,
        y,
        width: SIZE,
        height: SIZE,
        borderRadius: '9999px',
        backgroundColor: ACCENT,
        filter: `blur(${BLUR}px)`,
        mixBlendMode: 'screen',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 0.35 : 0 }}
      transition={{ duration: 0.6 }}
      className="pointer-events-none fixed left-0 top-0 z-[2]"
    />
  );
}
