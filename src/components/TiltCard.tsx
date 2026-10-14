'use client';

import { useEffect, type PointerEvent } from 'react';
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type MotionStyle,
} from 'motion/react';

// Hover weight for glass cards (PROJ-129): the point under the cursor sinks,
// the opposite side rises, and the card grows slightly. Springs, not state,
// carry the pointer, so nothing re-renders while the mouse moves.
//
// The sheen itself stays in globals.css: this only feeds it the tilt
// direction (--glass-tilt-angle, pointing at the side that sinks) and its
// strength (--glass-tilt, 0..1).
const MAX_TILT_DEG = 5;
const HOVER_SCALE = 1.02;
const SPRING = { stiffness: 180, damping: 18, mass: 0.8 };

type TiltCardProps = HTMLMotionProps<'div'> & {
  as?: 'div' | 'article';
  // The expanded ProductionCard keeps still.
  disabled?: boolean;
};

export function TiltCard({
  as = 'div',
  disabled = false,
  style,
  onPointerMove,
  onPointerLeave,
  ...props
}: TiltCardProps) {
  const reduce = useReducedMotion();
  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);
  const scale = useSpring(1, SPRING);

  const tiltAngle = useTransform(
    () => `${(Math.atan2(rotateY.get(), rotateX.get()) * 180) / Math.PI}deg`,
  );
  const tiltStrength = useTransform(() =>
    Math.min(1, Math.hypot(rotateX.get(), rotateY.get()) / MAX_TILT_DEG),
  );

  // Motion animates CSS variables in style, but its types don't list them.
  const sheenVars = {
    '--glass-tilt-angle': tiltAngle,
    '--glass-tilt': tiltStrength,
  } as MotionStyle;

  const rest = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  // A card that becomes disabled under a still mouse settles right away.
  useEffect(() => {
    if (!disabled) return;
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }, [disabled, rotateX, rotateY, scale]);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    if (disabled || reduce || e.pointerType !== 'mouse') {
      rest();
      return;
    }
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const rect = e.currentTarget.getBoundingClientRect();
    // -1..1 from the center; positive is right / down.
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    // rotateY > 0 pushes the right edge away; rotateX > 0 lifts the bottom.
    rotateY.set(nx * MAX_TILT_DEG);
    rotateX.set(-ny * MAX_TILT_DEG);
    scale.set(HOVER_SCALE);
  };

  const handlePointerLeave = (e: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(e);
    rest();
  };

  const Component = as === 'article' ? motion.article : motion.div;

  return (
    <Component
      {...props}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        ...style,
        transformPerspective: 800,
        rotateX,
        rotateY,
        scale,
        ...sheenVars,
      }}
    />
  );
}
