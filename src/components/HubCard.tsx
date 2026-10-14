import Image from 'next/image';
import Link from 'next/link';
import type { Icon } from '@phosphor-icons/react';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import type { HubDictionary } from '@/i18n/types';

type HubCardCopy = HubDictionary['cards'][keyof HubDictionary['cards']];

// The photo, or the glow standing in for it, grows a little on hover.
const backdropHover =
  'transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100';

type HubCardProps = {
  persona: 'audio' | 'dev';
  /** Position in the Hub, shown as "01 / AUDIO". */
  index: number;
  Icon: Icon;
  /** Background photo; without one, the card shows the persona's hero glow. */
  photo: { src: string; position: string } | null;
  copy: HubCardCopy;
};

// A standing card on desktop, a compact one on mobile, where both have to fit
// above the fold. `data-persona-card` gives the card its persona's tokens
// (accent, highlight, glow) while the Hub around it stays neutral.
export function HubCard({ persona, index, Icon, photo, copy }: HubCardProps) {
  return (
    <Link
      href={`/${persona}`}
      aria-label={copy.label}
      data-persona-card={persona}
      className="group relative isolate flex md:flex-1 flex-col justify-between h-[228px] md:h-auto md:min-h-[680px] rounded-3xl md:rounded-[28px] overflow-hidden p-4 md:p-7 bg-background text-white shadow-[0_20px_40px_color-mix(in_oklab,var(--brand-black)_45%,transparent)] md:shadow-[0_30px_60px_color-mix(in_oklab,var(--brand-black)_45%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {photo ? (
        <Image
          src={photo.src}
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 768px) 50vw, 100vw"
          style={{ objectPosition: photo.position }}
          className={`-z-10 object-cover ${backdropHover}`}
        />
      ) : (
        <div
          aria-hidden
          className={`absolute -z-10 -top-1/4 -right-1/2 size-[130%] md:-top-[10%] md:-right-[30%] md:size-[120%] rounded-full ${backdropHover}`}
          style={{ backgroundImage: 'var(--persona-glow)' }}
        />
      )}
      <div aria-hidden className="absolute inset-0 -z-10 hub-card-tint" />

      <div className="flex items-center justify-between px-1 pt-1 md:p-0 font-mono text-[11px] md:text-xs tracking-[0.14em] uppercase">
        <span>
          {String(index).padStart(2, '0')} / {persona}
        </span>
        <Icon aria-hidden className="size-[22px] md:size-7" />
      </div>

      <div className="glass flex items-center md:items-stretch justify-between md:flex-col gap-3 rounded-2xl md:rounded-[20px] py-3.5 pr-3.5 pl-4 md:p-6">
        <div className="flex flex-col gap-1 md:gap-3 min-w-0">
          <h2 className="text-2xl md:text-[34px] leading-none md:leading-[1.05] font-medium tracking-[-0.035em] md:tracking-[-0.025em]">
            {copy.title}
          </h2>
          <p className="text-[13px] text-white/80 md:hidden">{copy.short}</p>
          <p className="hidden md:block text-[15px] leading-normal text-white/80">
            {copy.description}
          </p>
        </div>
        <div className="flex items-center justify-between md:mt-1 shrink-0">
          <span className="hidden md:inline text-sm font-medium text-highlight">
            {copy.enter}
          </span>
          <span className="flex items-center justify-center size-11 rounded-full bg-accent ring-1 ring-highlight/40 group-hover:ring-2 group-hover:ring-highlight transition-shadow">
            <ArrowUpRight size={18} aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
