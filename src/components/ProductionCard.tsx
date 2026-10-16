import Image from 'next/image';
import { Play } from '@phosphor-icons/react/dist/ssr';
import type { AudioDictionary } from '@/i18n/types';
import { Chip } from './Chip';

type Production = AudioDictionary['projects']['productions'][number];

type ProductionCardProps = {
  prod: Production;
  /** "streams", after the count in the pill. */
  streamsLabel: string;
  /** The link's accessible name, "Watch DVD Temporal on YouTube". */
  label: string;
};

// The photo grows a little on hover, like the Hub cards'.
const photoHover =
  'transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100';

// Items inside glass are plain pills, not Chips (see CONTEXT.md): a thin
// border over the pane's own color.
const pill = 'inline-flex items-center h-7 px-3 rounded-full border border-ink/14 font-mono text-xs text-ink/80';

// A photo card, like the Hub's persona cards: the cover under the persona
// tint, the type and the streams on top, a glass pane at the bottom. Standing
// on desktop, with the description and the roles; compact on mobile, the pane
// one line of title, short role and play. The whole card opens the video on
// YouTube.
export function ProductionCard({ prod, streamsLabel, label }: ProductionCardProps) {
  return (
    <a
      href={prod.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative isolate flex flex-col justify-between h-[240px] md:h-[560px] rounded-3xl md:rounded-[28px] overflow-hidden p-3.5 md:p-[22px] bg-background text-white shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Image
        src={prod.image}
        alt=""
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        className={`-z-10 object-cover ${photoHover}`}
      />
      <div aria-hidden className="absolute inset-0 -z-10 persona-card-tint" />

      <div className="flex items-center justify-between gap-3 px-1 pt-1 md:p-0 font-mono text-[11px] md:text-xs tracking-[0.14em] uppercase">
        <span>{prod.label}</span>
        <Chip>
          {prod.streams} {streamsLabel}
        </Chip>
      </div>

      <div className="glass flex items-center md:items-stretch justify-between md:flex-col gap-3 md:gap-2.5 rounded-2xl md:rounded-[18px] py-3 pr-3 pl-4 md:p-5">
        <div className="flex flex-col gap-1 md:gap-2.5 min-w-0">
          <h3 className="text-[19px] md:text-2xl leading-tight md:leading-[1.1] font-medium tracking-[-0.02em] md:tracking-[-0.025em]">
            {prod.title}
          </h3>
          <p className="text-[13px] text-white/75 md:hidden">{prod.short}</p>
          <p className="hidden md:block text-sm leading-normal text-white/80">{prod.description}</p>
        </div>
        <div className="flex items-center justify-between gap-3 md:mt-1 shrink-0">
          <ul className="hidden md:flex flex-wrap gap-1.5">
            {prod.roles.map((role) => (
              <li key={role} className={pill}>
                {role}
              </li>
            ))}
          </ul>
          <span className="flex items-center justify-center size-11 md:size-10 shrink-0 rounded-full bg-accent ring-1 ring-highlight/40 group-hover:ring-2 group-hover:ring-highlight transition-shadow">
            <Play size={14} weight="fill" aria-hidden />
          </span>
        </div>
      </div>
    </a>
  );
}
