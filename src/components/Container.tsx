import type { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  /** 1600px instead of 1200px, for the Hero card. */
  wide?: boolean;
  className?: string;
};

// The persona pages' content column: 1200px wide at most, gutters included.
export function Container({ children, wide = false, className = '' }: ContainerProps) {
  return (
    <div
      className={`w-full ${wide ? 'max-w-[1600px]' : 'max-w-[1200px]'} mx-auto px-4 md:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
