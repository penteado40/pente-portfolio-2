'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';

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

export function Photos() {
  const { dict } = useLocale();
  const reduce = useReducedMotion();

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-[#f8f7f4] to-[#f3f1ec]">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-3xl md:text-4xl font-medium tracking-tight mb-12"
        >
          {dict.photos.title}
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[200px] md:auto-rows-[240px]">
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
        </div>
      </div>
    </section>
  );
}
