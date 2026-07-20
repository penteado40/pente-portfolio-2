'use client';

import { Certificate } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';

export function Certifications() {
  const { dict } = useLocale();
  const reduce = useReducedMotion();

  return (
    <section id="certifications" className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl font-medium tracking-tight mb-12"
        >
          {dict.certifications.title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dict.certifications.items.map((item, i) => (
            <motion.div
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
                  <div className="group relative w-full hover:z-10">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-110 group-hover:drop-shadow-2xl"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <p className="text-sm text-ink/60 mt-1">{item.issuer}</p>
                    <span className="text-xs font-mono text-accent tracking-wider mt-3 inline-block">
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
                  <span className="text-xs font-mono text-accent tracking-wider mt-3 inline-block">
                    {item.year}
                  </span>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
