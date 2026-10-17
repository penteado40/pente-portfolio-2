'use client';

import { useCallback, type PointerEvent } from 'react';
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type MotionStyle,
} from 'motion/react';
import { isFineMouse } from './isFineMouse';
import { pointerOffset } from './pointerOffset';

// Hover weight for glass cards: the point under the cursor sinks,
// the opposite side rises, and the card grows slightly. Springs, not state,
// carry the pointer, so nothing re-renders while the mouse moves.
//
// The sheen itself stays in globals.css: this only feeds it the tilt
// direction (--glass-tilt-angle, pointing at the side that sinks) and its
// strength (--glass-tilt, 0..1).
const MAX_TILT_DEG = 8;
const HOVER_SCALE = 1.04;
/** Also settles the Chips, so they move like the cards around them. */
export const TILT_SPRING = { stiffness: 180, damping: 18, mass: 0.8 };

// style is merged, but the tilt owns the transform: a caller's scale or
// rotate in style is overridden.
type TiltCardProps = HTMLMotionProps<'div'> & {
  as?: 'div' | 'article';
};

export function TiltCard({
  as = 'div',
  style,
  onPointerMove,
  onPointerLeave,
  ...props
}: TiltCardProps) {
  const reduce = useReducedMotion();
  const rotateX = useSpring(0, TILT_SPRING);
  const rotateY = useSpring(0, TILT_SPRING);
  const scale = useSpring(1, TILT_SPRING);

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

  const settle = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }, [rotateX, rotateY, scale]);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    if (reduce || !isFineMouse(e)) {
      settle();
      return;
    }

    const { nx, ny } = pointerOffset(e);
    // rotateY > 0 pushes the right edge away; rotateX > 0 lifts the bottom.
    rotateY.set(nx * MAX_TILT_DEG);
    rotateX.set(-ny * MAX_TILT_DEG);
    scale.set(HOVER_SCALE);
  };

  const handlePointerLeave = (e: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(e);
    settle();
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
