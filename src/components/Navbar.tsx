'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useReducedMotion,
  AnimatePresence,
} from 'motion/react';
import Link from 'next/link';
import { useLocale } from '@/i18n/LocaleProvider';
import { List, X, type Icon } from '@phosphor-icons/react';
import { useMagnetic } from './useMagnetic';

const HOVER_LEAVE_DELAY_MS = 400;

export type NavItem = { label: string; href: string; Icon: Icon };
export type NavAction = { label: string; Icon: Icon; onClick: () => void };

type NavbarProps = {
  /** Section anchors of the current page, shown as links (or icons when compact). */
  items: NavItem[];
  /** Persona-specific buttons, rendered after the links in every navbar state. */
  actions?: NavAction[];
};

export function Navbar({ items, actions = [] }: NavbarProps) {
  const { locale, setLocale } = useLocale();
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
              <Link
                href="/"
                className="font-medium text-sm tracking-tight text-white shrink-0"
              >
                Felipe Penteado
              </Link>

              <div className="hidden md:flex items-center gap-6">
                {items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {actions.map((action) => (
                  <NavActionButton key={action.label} action={action} />
                ))}
                <button
                  onClick={() => setLocale(locale === 'en' ? 'pt' : 'en')}
                  className="text-xs font-mono text-white/70 hover:text-white press uppercase tracking-wider px-2 py-1 rounded-lg"
                  aria-label={`Switch to ${locale === 'en' ? 'Portuguese' : 'English'}`}
                >
                  {locale === 'en' ? 'PT' : 'EN'}
                </button>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden text-white/80 p-1 press"
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
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="p-2 text-white/70 hover:text-white transition-colors rounded-full"
                  aria-label={item.label}
                >
                  <item.Icon size={16} />
                </a>
              ))}
              <div className="w-px h-4 bg-white/20 mx-1" />
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="p-2 text-white/70 hover:text-white press rounded-full"
                  aria-label={action.label}
                >
                  <action.Icon size={16} />
                </button>
              ))}
              <button
                onClick={() => setLocale(locale === 'en' ? 'pt' : 'en')}
                className="text-xs font-mono text-white/70 hover:text-white press uppercase tracking-wider px-2 py-1 rounded-full"
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
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-white/70 hover:text-white transition-colors py-1"
                >
                  {item.label}
                </a>
              ))}
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    setMobileOpen(false);
                    action.onClick();
                  }}
                  className="text-sm text-white/70 hover:text-white press py-1 text-left"
                >
                  {action.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

function NavActionButton({ action }: { action: NavAction }) {
  const magnet = useMagnetic<HTMLButtonElement>();

  return (
    <motion.button
      {...magnet}
      onClick={action.onClick}
      className="hidden md:inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3.5 py-1.5 rounded-full text-xs font-medium hover:ring-2 hover:ring-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight press shrink-0"
    >
      {action.label}
    </motion.button>
  );
}
