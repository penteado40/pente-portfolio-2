'use client';

import { useRef } from 'react';
import {
  motion,
  useTransform,
  useScroll,
  useReducedMotion,
} from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { ArrowDown } from '@phosphor-icons/react';
import { useMagnetic } from './useMagnetic';

export function Hero() {
  const { dict } = useLocale();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const ctaMagnet = useMagnetic<HTMLAnchorElement>();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  // With reduced motion the entrance keeps its fade but drops the slide.
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-end overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { scale: imgScale }}
      >
        <img
          src="/photos/photo_12.jpg"
          alt="Felipe Penteado at the studio console"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-block-deep via-block-deep/60 to-background/10" />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative w-full max-w-[1400px] mx-auto px-6 pb-16 md:pb-24 pt-24"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl space-y-5"
        >
          <motion.p
            variants={item}
            className="text-sm font-mono text-highlight tracking-wider"
          >
            {dict.hero.role}
          </motion.p>
          <motion.h1
            variants={item}
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[1.1] text-white"
          >
            {dict.hero.headline}
          </motion.h1>
          <motion.p
            variants={item}
            className="text-white/70 text-lg leading-relaxed max-w-[50ch]"
          >
            {dict.hero.subtitle}
          </motion.p>
          <motion.div variants={item}>
            <motion.a
              {...ctaMagnet}
              href="#projects"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium hover:ring-2 hover:ring-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight press"
            >
              {dict.hero.cta}
              <ArrowDown size={16} weight="bold" />
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
