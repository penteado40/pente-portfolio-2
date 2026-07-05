'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { Camera, InstagramLogo } from '@phosphor-icons/react';

const photos = [
  { src: '/photos/photo_1.jpg', span: 'row-span-2' },
  { src: '/photos/photo_16.jpg', span: '' },
  { src: '/photos/photo_3.jpg', span: 'row-span-2' },
  { src: '/photos/photo_11.jpg', span: 'row-span-2' },
  { src: '/photos/photo_5.jpg', span: '' },
  { src: '/photos/photo_4.jpg', span: 'row-span-2' },
  { src: '/photos/photo_8.jpg', span: '' },
  { src: '/photos/photo_22.jpg', span: 'row-span-2' },
  { src: '/photos/photo_14.jpg', span: '' },
  { src: '/photos/photo_10.jpg', span: '' },
  { src: '/photos/photo_6.jpg', span: 'row-span-2' },
  { src: '/photos/photo_12.jpg', span: 'row-span-2' },
  { src: '/photos/photo_7.jpg', span: '' },
  { src: '/photos/photo_24.jpg', span: 'row-span-2' },
  { src: '/photos/photo_2.jpg', span: '' },
  { src: '/photos/photo_9.jpg', span: '' },
  { src: '/photos/photo_13.jpg', span: 'row-span-2' },
  { src: '/photos/photo_17.jpg', span: '' },
  { src: '/photos/photo_18.jpg', span: '' },
  { src: '/photos/photo_15.jpg', span: 'row-span-2' },
  { src: '/photos/photo_20.jpg', span: '' },
  { src: '/photos/photo_19.jpg', span: 'row-span-2' },
  { src: '/photos/photo_21.jpg', span: 'row-span-2' },
  { src: '/photos/photo_23.jpg', span: 'row-span-2' },
  { src: '/photos/photo_25.jpg', span: '' },
  { src: '/photos/photo_26.jpg', span: '' },
  { src: '/photos/photo_27.jpg', span: '' },
];

const instagramPosts = [
  'https://www.instagram.com/p/DZJC0njx_kQ/',
  'https://www.instagram.com/p/DXecvK-Alxw/',
  'https://www.instagram.com/p/DSco_6sjtyV/',
  'https://www.instagram.com/p/DOT6zzlEaB3/',
  'https://www.instagram.com/p/DBr1f1vxw7g/',
  'https://www.instagram.com/p/DZ-2kO4i3R2/',
];

type Tab = 'photos' | 'instagram';

export function Photos() {
  const { dict } = useLocale();
  const reduce = useReducedMotion();
  const [activeTab, setActiveTab] = useState<Tab>('photos');

  const tabs: { key: Tab; label: string; Icon: typeof Camera }[] = [
    { key: 'photos', label: dict.photos.tabPhotos, Icon: Camera },
    { key: 'instagram', label: dict.photos.tabInstagram, Icon: InstagramLogo },
  ];

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-background to-mist">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-3xl md:text-4xl font-medium tracking-tight"
          >
            {dict.photos.title}
          </motion.h2>

          <div className="flex gap-1 bg-mist p-1 rounded-full w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-ink'
                    : 'text-ink/40 hover:text-ink/70'
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="photos-tab-bg"
                    className="absolute inset-0 bg-surface rounded-full shadow-sm"
                    transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <tab.Icon size={16} />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'photos' ? (
            <motion.div
              key="photos"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[200px] md:auto-rows-[240px]"
            >
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.src}
                  initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.04,
                    ease: [0.16, 1, 0.3, 1] as const,
                  }}
                  className={`rounded-xl overflow-hidden ${photo.span}`}
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
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {instagramPosts.map((postId, i) => (
                <motion.div
                  key={postId}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.06,
                    ease: [0.16, 1, 0.3, 1] as const,
                  }}
                  className="rounded-xl overflow-hidden glass"
                >
                  <iframe
                    src={`${postId}embed/`}
                    width="100%"
                    height="480"
                    className="border-0"
                    loading="lazy"
                    title={`Instagram post ${i + 1}`}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
