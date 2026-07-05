'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { SpeakerHighIcon, SpeakerSlashIcon, XIcon } from '@phosphor-icons/react';

const HOVER_DEBOUNCE_MS = 200;

type Production = {
  title: string;
  description: string;
  roles: string[];
  image?: string;
  streams?: string;
  youtubeId?: string;
  youtubeUrl?: string;
};

export function ProductionCard({
  prod,
  streamsLabel,
}: {
  prod: Production;
  streamsLabel: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [muted, setMuted] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasVideo = Boolean(prod.youtubeId);

  const clearHoverTimer = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }, []);

  const collapse = useCallback(() => {
    clearHoverTimer();
    setExpanded(false);
    setMuted(true);
  }, [clearHoverTimer]);

  useEffect(() => {
    if (!expanded) return;
    const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isTouch) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        collapse();
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [expanded, collapse]);

  useEffect(() => clearHoverTimer, [clearHoverTimer]);

  if (!hasVideo) {
    return <ProductionCardBody prod={prod} streamsLabel={streamsLabel} />;
  }

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    clearHoverTimer();
    hoverTimer.current = setTimeout(() => setExpanded(true), HOVER_DEBOUNCE_MS);
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    collapse();
  };

  const handleClick = () => {
    const isMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isMouse) return;
    setExpanded((v) => !v);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !muted;
    setMuted(next);
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: next ? 'mute' : 'unMute', args: [] }),
      '*',
    );
  };

  return (
    <div
      ref={cardRef}
      className={`production-card glass rounded-2xl overflow-hidden ${expanded ? 'is-active' : ''}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <div className="relative aspect-[16/9] bg-stone-900">
        {expanded ? (
          <>
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${prod.youtubeId}?autoplay=1&mute=1&controls=1&rel=0&playsinline=1&enablejsapi=1`}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={prod.title}
            />
            <button
              onClick={toggleMute}
              aria-label={muted ? 'Unmute video' : 'Mute video'}
              className="absolute bottom-3 right-3 z-10 glass-strong p-2 rounded-full text-stone-700"
            >
              {muted ? <SpeakerSlashIcon size={16} weight="bold" /> : <SpeakerHighIcon size={16} weight="bold" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                collapse();
              }}
              aria-label="Close preview"
              className="absolute top-3 right-3 z-10 glass-strong p-1.5 rounded-full text-stone-700"
            >
              <XIcon size={16} weight="bold" />
            </button>
          </>
        ) : (
          prod.image && (
            <Image
              src={prod.image}
              alt={prod.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )
        )}
      </div>
      <ProductionCardText prod={prod} streamsLabel={streamsLabel} />
    </div>
  );
}

function ProductionCardBody({ prod, streamsLabel }: { prod: Production; streamsLabel: string }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      {prod.image && (
        <div className="relative aspect-[16/9]">
          <Image
            src={prod.image}
            alt={prod.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <ProductionCardText prod={prod} streamsLabel={streamsLabel} />
    </div>
  );
}

function ProductionCardText({ prod, streamsLabel }: { prod: Production; streamsLabel: string }) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-2">
        {prod.youtubeUrl ? (
          <h4 className="font-medium">
            <a
              href={prod.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hover:text-amber-700 hover:underline underline-offset-2 transition-colors"
            >
              {prod.title}
            </a>
          </h4>
        ) : (
          <h4 className="font-medium">{prod.title}</h4>
        )}
        {prod.streams && (
          <span className="text-xs font-mono text-stone-400">
            {prod.streams} {streamsLabel}
          </span>
        )}
      </div>
      <p className="text-stone-500 text-sm leading-relaxed mb-3">{prod.description}</p>
      <div className="flex flex-wrap gap-2">
        {prod.roles.map((role) => (
          <span
            key={role}
            className="text-xs font-mono text-amber-700 bg-amber-50 px-3 py-1 rounded-full"
          >
            {role}
          </span>
        ))}
      </div>
    </div>
  );
}
