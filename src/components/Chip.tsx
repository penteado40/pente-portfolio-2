'use client';

import type { PointerEvent, ReactNode } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionStyle,
} from 'motion/react';
import type { Icon } from '@phosphor-icons/react';
import { isFineMouse } from './isFineMouse';
import { pointerOffset } from './pointerOffset';
import { TILT_SPRING } from './TiltCard';
import { useMagnetic } from './useMagnetic';

const HOVER_SCALE = 1.04;

type ChipProps = {
  children: ReactNode;
  /**
   * Inside a Color block, the .glass-block-* tint of the pane it sits on
   * (see globals.css); `neutral` elsewhere.
   */
  tone?: 'neutral' | 'block-mid';
  /**
   * A short link: highlight text, with the magnetic pull and the press. A
   * path ("/") goes through Next's router; http(s) opens in a new tab.
   */
  href?: string;
  /** Only for a link. */
  Icon?: Icon;
  /** Where the Icon sits: after the text (an action), or before it (a channel). */
  iconAt?: 'start' | 'end';
  /**
   * Shares a row with its siblings on a phone, 44px tall for the thumb;
   * its own width from md up (the persona Footer).
   */
  fill?: boolean;
};

// min-h, not h: a longer item (Audio's other work) wraps on a phone and
// grows to a second line instead of spilling out.
const base =
  'glass inline-flex items-center min-h-8 px-3 py-1.5 rounded-full font-mono text-xs';

const MotionLink = motion.create(Link);

const tints = {
  neutral: '',
  'block-mid': 'glass-block-mid',
} as const;

// A Chip (see CONTEXT.md): a small glass pill. Under a fine mouse the side
// of the glass under the cursor lights up and the chip grows a little; it
// never tilts, which would read as noise across a row of chips. Only the
// link variant also follows the cursor, so it is the one that reads as
// clickable.
export function Chip({
  children,
  tone = 'neutral',
  href,
  Icon,
  iconAt = 'end',
  fill = false,
}: ChipProps) {
  const reduce = useReducedMotion();
  const magnet = useMagnetic<HTMLElement>();
  // The sheen's direction follows the pointer right away; only its
  // strength and the scale spring, so the light never spins around.
  const angle = useMotionValue('0deg');
  const strength = useSpring(0, TILT_SPRING);
  const scale = useSpring(1, TILT_SPRING);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (href) magnet.onPointerMove(e);
    if (reduce || !isFineMouse(e)) return;
    const { nx, ny } = pointerOffset(e);
    // The sheen lights the side opposite --glass-tilt-angle (globals.css),
    // so point it away from the cursor.
    angle.set(`${(Math.atan2(-nx, ny) * 180) / Math.PI}deg`);
    strength.set(Math.min(1, Math.hypot(nx, ny)));
    scale.set(HOVER_SCALE);
  };

  const onPointerLeave = () => {
    if (href) magnet.onPointerLeave();
    strength.set(0);
    scale.set(1);
  };

  // Motion animates CSS variables in style, but its types don't list them.
  const style = {
    ...(href ? magnet.style : {}),
    scale,
    '--glass-tilt-angle': angle,
    '--glass-tilt': strength,
  } as MotionStyle;

  const className = `${base} ${tints[tone]} ${
    fill ? 'flex-1 md:flex-none justify-center min-h-11 md:min-h-8' : ''
  }`;
  const handlers = { onPointerMove, onPointerLeave, style };

  if (href) {
    const icon = Icon && <Icon size={12} weight="bold" aria-hidden className="shrink-0" />;
    const props = {
      ...handlers,
      className: `${className} gap-1.5 text-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight press`,
      children: (
        <>
          {iconAt === 'start' && icon}
          {children}
          {iconAt === 'end' && icon}
        </>
      ),
    };

    if (href.startsWith('/')) return <MotionLink href={href} {...props} />;
    const external = /^https?:/.test(href);
    return (
      <motion.a
        href={href}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
        {...props}
      />
    );
  }

  return (
    <motion.span {...handlers} className={`${className} text-ink/80`}>
      {children}
    </motion.span>
  );
}
