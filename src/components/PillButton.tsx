'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import type { Icon } from '@phosphor-icons/react';
import { useMagnetic } from './useMagnetic';

type PillButtonProps = {
  children: ReactNode;
  /** Drawn in the accent dot on the right. */
  Icon: Icon;
  className?: string;
} & (
  | { href: string }
  | {
      href?: undefined;
      type?: 'button' | 'submit';
      onClick?: () => void;
      disabled?: boolean;
    }
);

const pill =
  'group inline-flex items-center justify-between gap-3 h-[52px] pl-5 md:pl-[22px] pr-[7px] md:pr-2 rounded-full bg-white/8 backdrop-blur-sm border border-white/20 text-white text-[15px] font-medium hover:bg-white/12 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight press';

// The persona pages' CTA: a light pill with an accent dot holding the icon,
// ringed in highlight. A link when given `href`, a button otherwise.
export function PillButton({ children, Icon, className = '', ...props }: PillButtonProps) {
  const magnet = useMagnetic<HTMLElement>();

  const content = (
    <>
      {children}
      <span className="grid place-items-center size-[38px] shrink-0 rounded-full bg-accent ring-1 ring-highlight/40 group-hover:ring-2 group-hover:ring-highlight transition-shadow">
        <Icon size={18} aria-hidden />
      </span>
    </>
  );

  if (props.href !== undefined) {
    return (
      <motion.a {...magnet} href={props.href} className={`${pill} ${className}`}>
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
      className={`${pill} ${className}`}
    >
      {content}
    </motion.button>
  );
}
