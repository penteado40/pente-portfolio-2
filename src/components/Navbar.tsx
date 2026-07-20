'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useReducedMotion,
  AnimatePresence,
} from 'motion/react';
import { useLocale } from '@/i18n/LocaleProvider';
import { useTestimonialModal } from './TestimonialModalProvider';
import {
  User,
  MusicNotes,
  Clock,
  Certificate,
  GearSix,
  Envelope,
  List,
  X,
  ChatCircleText,
} from '@phosphor-icons/react';

const HOVER_LEAVE_DELAY_MS = 400;

const navItems = [
  { key: 'about' as const, href: '#about', Icon: User },
  { key: 'timeline' as const, href: '#timeline', Icon: Clock },
  { key: 'certifications' as const, href: '#certifications', Icon: Certificate },
  { key: 'projects' as const, href: '#projects', Icon: MusicNotes },
  { key: 'skills' as const, href: '#skills', Icon: GearSix },
  { key: 'contact' as const, href: '#contact', Icon: Envelope },
];

export function Navbar() {
  const { dict, locale, setLocale } = useLocale();
  const { open: openTestimonialModal } = useTestimonialModal();
  const { scrollY } = useScroll();
  const [inHero, setInHero] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();
  const hoverLeaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const hero = latest < window.innerHeight * 0.85;
    setInHero(hero);
    if (hero) setMobileOpen(false);
  });

  useEffect(() => {
    return () => {
      if (hoverLeaveTimeoutRef.current) clearTimeout(hoverLeaveTimeoutRef.current);
    };
  }, []);

  function handleMouseEnter() {
    if (hoverLeaveTimeoutRef.current) clearTimeout(hoverLeaveTimeoutRef.current);
    setHovered(true);
  }

  function handleMouseLeave() {
    hoverLeaveTimeoutRef.current = setTimeout(() => setHovered(false), HOVER_LEAVE_DELAY_MS);
  }

  const showExpanded = !inHero || hovered;

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.nav
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={reduce ? false : { y: -20, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          maxWidth: showExpanded ? 1024 : 340,
          borderRadius: showExpanded ? 16 : 999,
        }}
        transition={{
          y: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
          opacity: { duration: 0.6 },
          maxWidth: { type: 'spring', duration: 0.5, bounce: 0.15 },
          borderRadius: { type: 'spring', duration: 0.4, bounce: 0.1 },
        }}
        className="w-full glass-dark shadow-lg shadow-black/25 pointer-events-auto overflow-hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          {showExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex items-center justify-between px-6 h-14"
            >
              <a
                href="#"
                className="font-medium text-sm tracking-tight text-white shrink-0"
              >
                Felipe Penteado
              </a>

              <div className="hidden md:flex items-center gap-6">
                {navItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    className="text-sm text-white/70 hover:text-accent transition-colors"
                  >
                    {dict.nav[item.key]}
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={openTestimonialModal}
                  className="hidden md:inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3.5 py-1.5 rounded-full text-xs font-medium hover:bg-white/20 transition-colors active:scale-[0.98] shrink-0"
                >
                  {dict.testimonials.cta}
                </button>
                <button
                  onClick={() => setLocale(locale === 'en' ? 'pt' : 'en')}
                  className="text-xs font-mono text-white/50 hover:text-accent transition-colors uppercase tracking-wider px-2 py-1 rounded-lg hover:bg-white/10"
                  aria-label={`Switch to ${locale === 'en' ? 'Portuguese' : 'English'}`}
                >
                  {locale === 'en' ? 'PT' : 'EN'}
                </button>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden text-white/80 p-1"
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X size={20} /> : <List size={20} />}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex items-center justify-center gap-1 px-3 h-11"
            >
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="p-2 text-white/70 hover:text-accent transition-colors rounded-full hover:bg-white/10"
                  aria-label={dict.nav[item.key]}
                >
                  <item.Icon size={16} />
                </a>
              ))}
              <div className="w-px h-4 bg-white/20 mx-1" />
              <button
                onClick={openTestimonialModal}
                className="p-2 text-white/70 hover:text-accent transition-colors rounded-full hover:bg-white/10"
                aria-label={dict.testimonials.cta}
              >
                <ChatCircleText size={16} />
              </button>
              <button
                onClick={() => setLocale(locale === 'en' ? 'pt' : 'en')}
                className="text-xs font-mono text-white/50 hover:text-accent transition-colors uppercase tracking-wider px-2 py-1 rounded-full hover:bg-white/10"
                aria-label={`Switch to ${locale === 'en' ? 'Portuguese' : 'English'}`}
              >
                {locale === 'en' ? 'PT' : 'EN'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileOpen && showExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden px-6 pb-4 flex flex-col gap-3 border-t border-white/10 overflow-hidden"
            >
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-white/70 hover:text-accent transition-colors py-1"
                >
                  {dict.nav[item.key]}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openTestimonialModal();
                }}
                className="text-sm text-white/70 hover:text-accent transition-colors py-1 text-left"
              >
                {dict.testimonials.cta}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
