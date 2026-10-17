import type { PointerEvent } from 'react';

// Where the pointer sits over the element: -1..1 from its center on each
// axis, positive right / down. Shared by the hover effects (TiltCard, Chip).
export function pointerOffset(e: PointerEvent<Element>) {
  const rect = e.currentTarget.getBoundingClientRect();
  return {
    nx: ((e.clientX - rect.left) / rect.width) * 2 - 1,
    ny: ((e.clientY - rect.top) / rect.height) * 2 - 1,
  };
}
