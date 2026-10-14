'use client';

import { useEffect, useState } from 'react';

// A thin band a little above the middle of the viewport: the section crossing
// it is the one being read. Over the Hero, no section is active.
const READING_BAND = '-40% 0px -55% 0px';

/**
 * Which of the given anchors (`#about`, …) is being read, or null. Anchors
 * without a section on the page are ignored.
 */
export function useActiveSection(hrefs: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = hrefs.join(' ');

  useEffect(() => {
    const sections = key
      .split(' ')
      .map((href) => document.getElementById(href.slice(1)))
      .filter((section) => section !== null);
    const inBand = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target);
          else inBand.delete(entry.target);
        }
        const current = sections.find((section) => inBand.has(section));
        setActive(current ? `#${current.id}` : null);
      },
      { rootMargin: READING_BAND },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
