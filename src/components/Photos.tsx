'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { galleryPhotos, sectionIndex, type PhotoShape } from '@/content/audio';
import { useLocale } from '@/i18n/LocaleProvider';
import type { AudioDictionary } from '@/i18n/types';
import { Container } from './Container';
import { SectionHeader } from './SectionHeader';
import { TiltCard } from './TiltCard';
import { EASE_OUT } from './easing';

const instagramPosts = [
  'https://www.instagram.com/p/DZJC0njx_kQ/',
  'https://www.instagram.com/p/DXecvK-Alxw/',
  'https://www.instagram.com/p/DSco_6sjtyV/',
  'https://www.instagram.com/p/DOT6zzlEaB3/',
  'https://www.instagram.com/p/DBr1f1vxw7g/',
  'https://www.instagram.com/p/DZ-2kO4i3R2/',
];

const SHAPE_SPAN: Record<PhotoShape, string> = {
  single: '',
  tall: 'row-span-2',
  wide: 'col-span-2',
};

type Tab = 'photos' | 'instagram';
const TABS: Tab[] = ['photos', 'instagram'];

// The gallery under a segmented control, Photos or Instagram. The photos
// are a mosaic of four columns on desktop and two on a phone, packed dense:
// galleryPhotos' order is what fills every row (see audio.test.ts).
export function Photos() {
  const { dict } = useLocale<AudioDictionary>();
  const reduce = useReducedMotion();
  const [activeTab, setActiveTab] = useState<Tab>('photos');
  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({});
  const text = dict.photos;
  const labels: Record<Tab, string> = { photos: text.tabPhotos, instagram: text.tabInstagram };

  // A tablist is one tab stop: the arrows, Home and End move between the
  // tabs and select as they go.
  const onKeyDown = (e: KeyboardEvent) => {
    const i = TABS.indexOf(activeTab);
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: TABS.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const tab = TABS[(next + TABS.length) % TABS.length];
    setActiveTab(tab);
    tabRefs.current[tab]?.focus();
  };

  const tabs = (
    <div
      role="tablist"
      aria-label={text.tabsLabel}
      onKeyDown={onKeyDown}
      className="inline-flex items-center h-11 p-1 rounded-full bg-ink/6 border border-ink/10"
    >
      {TABS.map((tab) => {
        const selected = tab === activeTab;
        return (
          <button
            key={tab}
            ref={(el) => {
              tabRefs.current[tab] = el;
            }}
            type="button"
            role="tab"
            id={`photos-tab-${tab}`}
            aria-selected={selected}
            aria-controls={`photos-panel-${tab}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => setActiveTab(tab)}
            className={`relative h-[34px] px-4 rounded-full text-[13px] font-medium press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight ${
              selected ? 'text-ink' : 'text-ink/70 hover:text-ink'
            }`}
          >
            {selected && (
              <motion.span
                layoutId="photos-tab"
                aria-hidden
                className="absolute inset-0 rounded-full bg-accent ring-1 ring-highlight/40"
                transition={reduce ? { duration: 0 } : { type: 'spring', duration: 0.4, bounce: 0.15 }}
              />
            )}
            <span className="relative">{labels[tab]}</span>
          </button>
        );
      })}
    </div>
  );

  const panel = {
    role: 'tabpanel',
    id: `photos-panel-${activeTab}`,
    'aria-labelledby': `photos-tab-${activeTab}`,
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? undefined : { opacity: 0, y: -12 },
    transition: { duration: 0.25, ease: EASE_OUT },
  } as const;

  return (
    <section id="photos" className="pb-[72px] md:pb-[120px]">
      <Container>
        <SectionHeader
          index={sectionIndex('photos')}
          label={text.label}
          title={text.title}
          aside={tabs}
        />

        <AnimatePresence mode="wait">
          {activeTab === 'photos' ? (
            <motion.div
              key="photos"
              {...panel}
              // Nothing inside takes focus, so the panel itself is the stop after the tabs.
              tabIndex={0}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight rounded-[20px] grid grid-cols-2 md:grid-cols-4 grid-flow-dense auto-rows-[150px] md:auto-rows-[180px] lg:auto-rows-[220px] gap-2.5 md:gap-4"
            >
              {galleryPhotos.map((photo, i) => (
                <motion.div
                  key={photo.src}
                  initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.04, ease: EASE_OUT }}
                  className={`rounded-2xl md:rounded-[20px] overflow-hidden bg-mist ${SHAPE_SPAN[photo.shape]}`}
                >
                  <img
                    src={photo.src}
                    alt=""
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="instagram"
              {...panel}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
            >
              {instagramPosts.map((post, i) => (
                <TiltCard
                  key={post}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: EASE_OUT }}
                  className="rounded-[20px] overflow-hidden glass"
                >
                  <iframe
                    src={`${post}embed/`}
                    width="100%"
                    height="480"
                    className="border-0"
                    loading="lazy"
                    title={`Instagram post ${i + 1}`}
                  />
                </TiltCard>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
