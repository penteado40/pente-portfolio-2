'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useLocale } from '@/i18n/LocaleProvider';
import { X, type Icon } from '@phosphor-icons/react';
import { useActiveSection } from './useActiveSection';
import { useInHero } from './useInHero';
import { useLocaleSwitch } from './useLocaleSwitch';
import { FOCUSABLE_SELECTOR, wrapFocus } from './focusTrap';
import type { PersonaOption } from '@/content/personas';

const HOVER_LEAVE_DELAY_MS = 400;
const EXPANDED_MAX_WIDTH = 920;
// The desktop island's heights, border included: a 44px row of targets when
// compact, the LP boards' 56px when expanded.
const COMPACT_HEIGHT = 46;
const EXPANDED_HEIGHT = 56;
// Until the compact pill is measured on the client.
const COMPACT_FALLBACK_WIDTH = 380;
// The desktop island's bottom edge (top-4 + h-14): it expands once the hero
// has scrolled up past it.
const ISLAND_BOTTOM = 72;
// Tailwind's `lg`: the desktop island from here up, the mobile pill below.
const DESKTOP_QUERY = '(min-width: 64rem)';

// Both navbars slide in from above on load.
const ENTRANCE = { y: -20, opacity: 0 };
const ENTRANCE_EASE = [0.23, 1, 0.32, 1] as const;

// Every control is a 44px target; most draw a smaller shape inside it.
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight';

// The islands, the persona pill and the mobile menu share one material.
const glass = 'glass-dark shadow-lg shadow-black/25';

export type NavItem = { label: string; href: string; Icon: Icon };
export type NavAction = { label: string; Icon: Icon; onClick: () => void };

type NavSection = NavItem & { active: boolean };

type NavbarProps = {
  /** Section anchors of the current page: links when expanded or in the mobile menu, icons when compact. */
  items: NavItem[];
  /** Persona-specific buttons, shown only as entries in the mobile menu. */
  actions?: NavAction[];
  /** The personas to switch between, in the segmented selector beside the island. */
  personas: PersonaOption[];
};

export function Navbar({ items, actions = [], personas }: NavbarProps) {
  const active = useActiveSection(items.map((item) => item.href));
  const sections = items.map((item) => ({ ...item, active: item.href === active }));

  return (
    <div className="fixed top-3 lg:top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <MobileNavbar sections={sections} actions={actions} personas={personas} />
      <DesktopNavbar sections={sections} personas={personas} />
    </div>
  );
}

type NavbarViewProps = { sections: NavSection[]; personas: PersonaOption[] };

// Below `lg`: an island that always stays compact, with the sections in a
// menu, and the persona pill beside it.
function MobileNavbar({
  sections,
  actions,
  personas,
}: NavbarViewProps & { actions: NavAction[] }) {
  const { dict } = useLocale();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);
    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      } else if (event.key === 'Tab') {
        const target = wrapFocus(
          focusables(),
          document.activeElement as HTMLElement | null,
          event.shiftKey,
        );
        if (target) {
          event.preventDefault();
          target.focus();
        }
      }
    }
    // Anywhere but the panel closes it, the persona pill and the island's
    // other controls included; the toggle button is left to its own click.
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    }
    // The panel is hidden from `lg` up; a trap on hidden links would strand focus.
    const desktop = window.matchMedia(DESKTOP_QUERY);
    function onDesktop() {
      if (desktop.matches) setOpen(false);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    desktop.addEventListener('change', onDesktop);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [open]);

  return (
    <motion.nav
      initial={reduce ? false : ENTRANCE}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: ENTRANCE_EASE }}
      className="lg:hidden relative flex items-center gap-2 pointer-events-auto"
    >
      <div className={`flex items-center h-12 px-0.5 rounded-full ${glass}`}>
        <HomeLink />
        <LocaleButton />
        <button
          ref={buttonRef}
          onClick={() => setOpen(!open)}
          aria-label={dict.navbar.sectionMenu}
          aria-expanded={open}
          // The panel is only in the DOM while open.
          aria-controls={open ? panelId : undefined}
          className={`group grid place-items-center size-11 rounded-full press ${focusRing}`}
        >
          <span className="grid place-items-center size-9 rounded-full bg-white/8 text-white group-hover:bg-white/12 transition-colors">
            {open ? <X size={18} aria-hidden /> : <TwoLinesIcon />}
          </span>
        </button>
      </div>
      <PersonaPill personas={personas} className="h-12" />

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id={panelId}
            role="group"
            aria-label={dict.navbar.sectionMenu}
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            // Under the island, as wide as both pills.
            className={`absolute top-full left-0 mt-2 flex flex-col w-full min-w-60 p-2 rounded-2xl ${glass}`}
          >
            {sections.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={item.active ? 'true' : undefined}
                className={`flex items-center h-11 px-3 rounded-xl text-sm transition-colors ${focusRing} ${
                  item.active ? 'text-highlight' : 'text-white/70 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
            {actions.length > 0 && <span aria-hidden className="h-px mx-3 my-1 bg-white/10" />}
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  setOpen(false);
                  action.onClick();
                }}
                className={`flex items-center gap-2.5 h-11 px-3 rounded-xl text-sm text-left text-white hover:bg-white/8 press ${focusRing}`}
              >
                <action.Icon size={16} aria-hidden className="text-highlight" />
                {action.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// From `lg` up: the island is compact over the Hero, expanded once scrolled
// past it or on hover. Only the island starts the hover; the persona pill
// keeps it expanded on the way over, so the pill doesn't slide away from the
// pointer.
// The page's hero carries `data-hero` (see useInHero).
function DesktopNavbar({ sections, personas }: NavbarViewProps) {
  const { dict } = useLocale();
  const inHero = useInHero(ISLAND_BOTTOM);
  const [hovered, setHovered] = useState(false);
  const [compactWidth, setCompactWidth] = useState(COMPACT_FALLBACK_WIDTH);
  const [compactEl, setCompactEl] = useState<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const islandRef = useRef<HTMLDivElement>(null);
  const hoverLeaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hoverLeaveTimeoutRef.current) clearTimeout(hoverLeaveTimeoutRef.current);
    };
  }, []);

  function cancelHoverLeave() {
    if (hoverLeaveTimeoutRef.current) clearTimeout(hoverLeaveTimeoutRef.current);
  }

  function handleMouseEnter() {
    cancelHoverLeave();
    setHovered(true);
  }

  function handleMouseLeave() {
    hoverLeaveTimeoutRef.current = setTimeout(() => setHovered(false), HOVER_LEAVE_DELAY_MS);
  }

  const showExpanded = !inHero || hovered;

  // The compact island hugs its content, which changes with the persona's
  // sections. Measured while it is mounted; the last width is kept while
  // expanded.
  useEffect(() => {
    if (!compactEl) return;
    // + the island's own border, read off the island rather than assumed. A
    // ResizeObserver also reports once on observe.
    const observer = new ResizeObserver(() => {
      const island = islandRef.current;
      const border = island ? island.offsetWidth - island.clientWidth : 0;
      setCompactWidth(compactEl.offsetWidth + border);
    });
    observer.observe(compactEl);
    return () => observer.disconnect();
  }, [compactEl]);

  return (
    <motion.nav
      initial={reduce ? false : ENTRANCE}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: ENTRANCE_EASE }}
      // The island grows into the free space up to its max width; the pill
      // sits beside it and stretches to its height, so it follows the island
      // as it shrinks and expands.
      className="hidden lg:flex w-full justify-center gap-2.5"
    >
      <motion.div
        ref={islandRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          maxWidth: showExpanded ? EXPANDED_MAX_WIDTH : compactWidth,
          height: showExpanded ? EXPANDED_HEIGHT : COMPACT_HEIGHT,
        }}
        transition={{
          maxWidth: { type: 'spring', duration: 0.5, bounce: 0.15 },
          height: { type: 'spring', duration: 0.5, bounce: 0.15 },
        }}
        className={`flex-1 min-w-0 rounded-full ${glass} pointer-events-auto overflow-hidden`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {showExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex items-center justify-between gap-4 px-2.5 h-full"
            >
              <Link
                href="/"
                aria-label={dict.navbar.home}
                className={`flex items-center gap-2.5 h-11 min-w-11 pr-1.5 rounded-full shrink-0 text-sm font-medium tracking-tight whitespace-nowrap text-white ${focusRing}`}
              >
                <Logo />
                <span>Felipe Penteado</span>
              </Link>

              <div className="flex items-center gap-5">
                {sections.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={item.active ? 'true' : undefined}
                    className={`flex items-center justify-center h-11 min-w-11 text-sm whitespace-nowrap transition-colors ${focusRing} ${
                      item.active ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <span
                      className={`py-1.5 ${
                        item.active ? 'shadow-[inset_0_-2px_0_var(--color-highlight)]' : ''
                      }`}
                    >
                      {item.label}
                    </span>
                  </a>
                ))}
              </div>

              <div className="shrink-0">
                <LocaleButton />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="compact"
              ref={setCompactEl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex items-center w-max mx-auto px-px h-full"
            >
              <HomeLink />
              <Separator />
              {sections.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  aria-current={item.active ? 'true' : undefined}
                  className={`group grid place-items-center size-11 rounded-full ${focusRing}`}
                >
                  <span
                    className={`grid place-items-center size-8 rounded-full transition-colors ${
                      item.active
                        ? 'text-highlight bg-highlight/14'
                        : 'text-white/70 group-hover:text-white'
                    }`}
                  >
                    <item.Icon size={16} aria-hidden />
                  </span>
                </a>
              ))}
              <Separator />
              <LocaleButton />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <PersonaPill
        personas={personas}
        className="shrink-0"
        // Holds a hover expansion, never starts one.
        onMouseEnter={cancelHoverLeave}
        onMouseLeave={() => {
          if (hovered) handleMouseLeave();
        }}
      />
    </motion.nav>
  );
}

// The segmented selector in its own glass pill, beside the island.
function PersonaPill({
  personas,
  className,
  onMouseEnter,
  onMouseLeave,
}: {
  personas: PersonaOption[];
  className: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const { dict } = useLocale();

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="group"
      aria-label={dict.navbar.personaSwitch}
      // The current persona's fill keeps a 6px inset, so it grows with the pill.
      className={`flex items-stretch px-1 rounded-full ${glass} pointer-events-auto ${className}`}
    >
      {personas.map((option) => (
        <Link
          key={option.href}
          href={option.href}
          aria-current={option.current ? 'page' : undefined}
          className={`group flex items-stretch min-w-11 py-1.5 rounded-full ${focusRing}`}
        >
          <span
            className={`flex items-center px-3.5 rounded-full text-xs font-medium transition-colors ${
              option.current
                ? 'bg-accent text-white ring-1 ring-highlight'
                : 'text-white/70 group-hover:text-white'
            }`}
          >
            {option.label}
          </span>
        </Link>
      ))}
    </div>
  );
}

function HomeLink() {
  const { dict } = useLocale();

  return (
    <Link
      href="/"
      aria-label={dict.navbar.home}
      className={`grid place-items-center size-11 rounded-full ${focusRing}`}
    >
      <Logo />
    </Link>
  );
}

function Logo() {
  return (
    <span
      aria-hidden
      className="grid place-items-center size-8 shrink-0 rounded-full bg-ink text-background text-xs font-semibold"
    >
      FP
    </span>
  );
}

function TwoLinesIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

function Separator() {
  return <span aria-hidden className="w-px h-4 mx-1 bg-white/20 shrink-0" />;
}

function LocaleButton() {
  const { label, ariaLabel, switchLocale } = useLocaleSwitch();

  return (
    <button
      onClick={switchLocale}
      aria-label={ariaLabel}
      className={`grid place-items-center h-11 min-w-11 px-2 rounded-full font-mono text-xs uppercase tracking-wider text-white/70 hover:text-white press ${focusRing}`}
    >
      {label}
    </button>
  );
}
