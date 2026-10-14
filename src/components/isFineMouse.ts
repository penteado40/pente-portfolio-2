// Hover effects (card tilt, magnetic buttons) run only for a fine mouse, as
// does the `press` utility in globals.css: touch gets none of them.
export function isFineMouse(e: { pointerType: string }) {
  return (
    e.pointerType === 'mouse' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
}
