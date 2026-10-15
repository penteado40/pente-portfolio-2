'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { personaHref } from '@/content/personas';

// Anchors the single-page site had at `/` before the Audio persona moved to
// `/audio`. Old shared links like `/#contact` are forwarded there.
const AUDIO_ANCHORS = new Set([
  'about',
  'timeline',
  'certifications',
  'projects',
  'skills',
  'contact',
  'testimonials',
  'photos',
]);

export function LegacyHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const anchor = window.location.hash.slice(1);
    if (AUDIO_ANCHORS.has(anchor)) router.replace(`${personaHref('audio')}#${anchor}`);
  }, [router]);

  return null;
}
