import type { ReactNode } from 'react';

type SectionLabelProps = {
  /** Position on the page, shown as "02 / About". */
  index: number;
  label: string;
  /** Highlight above a section title; ink over a photo (Hero, Hub cards). */
  tone?: 'highlight' | 'ink';
};

// The mono "NN / Section" label.
export function SectionLabel({ index, label, tone = 'highlight' }: SectionLabelProps) {
  return (
    <span
      className={`font-mono text-[11px] md:text-xs tracking-[0.14em] uppercase ${
        tone === 'highlight' ? 'text-highlight' : 'text-ink'
      }`}
    >
      {String(index).padStart(2, '0')} / {label}
    </span>
  );
}

type SectionHeaderProps = Omit<SectionLabelProps, 'tone'> & {
  title: ReactNode;
  /** Text or an action aligned to the right of the title (below it on mobile). */
  aside?: ReactNode;
  className?: string;
};

export function SectionHeader({ index, label, title, aside, className = '' }: SectionHeaderProps) {
  const heading = (
    <div className="flex flex-col gap-3 md:gap-3.5">
      <SectionLabel index={index} label={label} />
      <h2 className="text-[34px] md:text-5xl leading-[1.05] md:leading-[1.02] font-medium tracking-[-0.035em] text-white">
        {title}
      </h2>
    </div>
  );

  return (
    <div className={`mb-7 md:mb-12 ${className}`}>
      {aside ? (
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8">
          {heading}
          <div className="md:max-w-[420px] md:shrink-0">{aside}</div>
        </div>
      ) : (
        heading
      )}
    </div>
  );
}
