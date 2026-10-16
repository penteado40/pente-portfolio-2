'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'motion/react';
import { Play } from '@phosphor-icons/react';
import type { AudioDictionary } from '@/i18n/types';
import { Chip } from './Chip';
import { pill } from './pill';

type Production = AudioDictionary['projects']['productions'][number];

type ProductionCardProps = {
  prod: Production;
  /** "streams", after the count in the pill. */
  streamsLabel: string;
  /** The link's accessible name, "Watch DVD Temporal on YouTube". */
  watchLabel: string;
};

// Long enough that a mouse passing over the row doesn't start every video.
const HOVER_DEBOUNCE_MS = 600;
const YT_PLAYING = 1;

// The photo grows a little on hover, like the Hub cards'.
const photoHover =
  'transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100';

// A photo card, like the Hub's persona cards: the cover under the persona
// tint, the type and the streams on top, a glass pane at the bottom. Standing
// on desktop, with the description and the roles; compact on mobile, the pane
// one line of title, short role and play. The whole card opens the video on
// YouTube.
//
// Resting a mouse on it plays a muted preview in place of the cover, under
// the same tint. The player sits beside the link, not inside it (an iframe
// can't be in an <a>), and takes no pointer, so a click still opens the
// video. Touch and reduced motion keep the cover.
export function ProductionCard({ prod, streamsLabel, watchLabel }: ProductionCardProps) {
  const reduce = useReducedMotion();
  const [preview, setPreview] = useState(false);
  const [playing, setPlaying] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const clearHoverTimer = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };

  useEffect(() => clearHoverTimer, []);

  // The player shows its title and a spinner until the video starts, so it
  // fades in only once it reports playing (YouTube's iframe API messages).
  useEffect(() => {
    if (!preview) return;
    const onMessage = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow || typeof e.data !== 'string') return;
      try {
        const { event, info } = JSON.parse(e.data);
        const state = event === 'onStateChange' ? info : info?.playerState;
        if (state === YT_PLAYING) setPlaying(true);
      } catch {
        // Not a player message.
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [preview]);

  // The player only starts sending its state once asked to.
  const listen = () => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'listening' }), '*');
  };

  const onPointerEnter = (e: PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse') return;
    clearHoverTimer();
    hoverTimer.current = setTimeout(() => setPreview(true), HOVER_DEBOUNCE_MS);
  };

  const onPointerLeave = () => {
    clearHoverTimer();
    setPreview(false);
    setPlaying(false);
  };

  return (
    <div
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="group relative isolate h-[240px] md:h-[560px] rounded-3xl md:rounded-[28px] overflow-hidden bg-background text-white shadow-card has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-highlight has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-background"
    >
      <Image
        src={prod.image}
        alt=""
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        className={`-z-10 object-cover ${photoHover}`}
      />
      {preview && (
        // 16:9 at the card's full height, centered, so it covers like the photo.
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${prod.youtubeId}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=${prod.youtubeId}&enablejsapi=1`}
          title={prod.title}
          aria-hidden
          tabIndex={-1}
          allow="autoplay; encrypted-media"
          onLoad={listen}
          className={`absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full aspect-video min-w-full border-0 pointer-events-none transition-opacity duration-500 ${
            playing ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      <div aria-hidden className="absolute inset-0 -z-10 persona-card-tint" />

      <a
        href={prod.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={watchLabel}
        className="absolute inset-0 flex flex-col justify-between p-3.5 md:p-[22px] focus-visible:outline-none"
      >
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
                <li key={role} className={`${pill} border-ink/14 text-ink/80`}>
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
    </div>
  );
}
