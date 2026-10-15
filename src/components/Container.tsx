import type { ReactNode } from 'react';

// The persona pages' content column: 1200px wide at most, gutters included.
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`w-full max-w-[1200px] mx-auto px-4 md:px-8 ${className}`}>{children}</div>;
}
