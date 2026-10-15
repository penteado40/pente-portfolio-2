'use client';

import { Certificate } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';
import type { Certification } from '@/content/certification';
import { TiltCard } from './TiltCard';

type CertificationsProps = {
  /** The persona's own list; empty renders nothing. */
  items: readonly Certification[];
  title: string;
};

// Shared by the personas, each passing its own list. A persona hides the
// Navbar anchor on its own while its list is empty.
export function Certifications({ items, title }: CertificationsProps) {
  const reduce = useReducedMotion();

  if (items.length === 0) return null;

  return (
    <section id="certifications" className="py-24 md:py-32 bg-mist">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl font-medium tracking-tight mb-12"
        >
          {title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <TiltCard
              key={`${item.title}-${item.year}`}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={
                item.image
                  ? 'relative rounded-2xl glass max-w-xs'
                  : 'relative glass rounded-2xl p-6 max-w-xs'
              }
            >
              {item.image ? (
                <>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto block rounded-t-2xl"
                    loading="lazy"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <p className="text-sm text-ink/60 mt-1">{item.issuer}</p>
                    <span className="text-xs font-mono text-ink tracking-wider mt-3 inline-block">
                      {item.year}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg shadow-accent/20 mb-4">
                    <Certificate size={22} className="text-white" weight="fill" />
                  </div>
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-sm text-ink/60 mt-1">{item.issuer}</p>
                  <span className="text-xs font-mono text-ink tracking-wider mt-3 inline-block">
                    {item.year}
                  </span>
                </>
              )}
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
