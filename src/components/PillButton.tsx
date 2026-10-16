'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import type { Icon } from '@phosphor-icons/react';
import { useMagnetic } from './useMagnetic';

type PillButtonProps = {
  children: ReactNode;
  /** Drawn in the accent dot on the right, or inline after the text when outlined. */
  Icon: Icon;
  /** Outline: a transparent pill without the dot, for a secondary action. */
  variant?: 'solid' | 'outline';
  className?: string;
} & (
  | { href: string; download?: boolean }
  | {
      href?: undefined;
      type?: 'button' | 'submit';
      onClick?: () => void;
      disabled?: boolean;
      /** Spins the icon and sets aria-busy, while a form is sending. */
      busy?: boolean;
    }
);

const base =
  'group inline-flex items-center h-[52px] rounded-full border border-white/20 text-white text-[15px] font-medium disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight press';
const variants = {
  solid: `${base} justify-between gap-3 pl-5 md:pl-[22px] pr-[7px] md:pr-2 bg-white/8 backdrop-blur-sm hover:bg-white/12`,
  outline: `${base} justify-center gap-2 px-[22px] hover:bg-white/8`,
};

// The persona pages' CTA: a light pill with an accent dot holding the icon,
// ringed in highlight. A link when given `href`, a button otherwise.
export function PillButton({
  children,
  Icon,
  variant = 'solid',
  className = '',
  ...props
}: PillButtonProps) {
  const magnet = useMagnetic<HTMLElement>();
  const pill = variants[variant];
  const busy = props.href === undefined && props.busy;
  const spin = busy ? 'animate-spin' : '';

  const content =
    variant === 'solid' ? (
      <>
        {children}
        <span className="grid place-items-center size-[38px] shrink-0 rounded-full bg-accent ring-1 ring-highlight/40 group-hover:ring-2 group-hover:ring-highlight transition-shadow">
          <Icon size={18} aria-hidden className={spin} />
        </span>
      </>
    ) : (
      <>
        {children}
        <Icon size={16} weight="bold" aria-hidden className={spin} />
      </>
    );

  if (props.href !== undefined) {
    return (
      <motion.a
        {...magnet}
        href={props.href}
        download={props.download}
        className={`${pill} ${className}`}
      >
        {content}
      </motion.a>
    );
  }

  const { type = 'button', onClick, disabled } = props;
  return (
    <motion.button
      {...magnet}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-busy={busy || undefined}
      className={`${pill} ${className}`}
    >
      {content}
    </motion.button>
  );
}
