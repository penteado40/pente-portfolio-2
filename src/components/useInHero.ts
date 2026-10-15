'use client';

import { useEffect, useState } from 'react';

/**
 * Whether any of the page's hero (the element marked `data-hero`) still shows
 * below the top `topInset` px of the viewport, the band the Navbar covers.
 * Follows the hero element itself, so it holds for any hero height and any
 * window height. True until the observer first reports.
 */
export function useInHero(topInset: number) {
  const [inHero, setInHero] = useState(true);

  useEffect(() => {
    const hero = document.querySelector('[data-hero]');
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInHero(entry.isIntersecting),
      { rootMargin: `-${topInset}px 0px 0px 0px` },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [topInset]);

  return inHero;
}
