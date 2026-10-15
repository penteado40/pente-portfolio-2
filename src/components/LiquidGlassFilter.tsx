'use client';

import { useEffect } from 'react';

// SVG filter for the Liquid Glass refraction, referenced by the .glass*
// classes in globals.css as `backdrop-filter: url(#liquid-glass-refraction)`.
// Only Chromium renders an SVG filter inside backdrop-filter; Safari and
// Firefox drop or garble it. So refraction is gated on `data-glass-refraction`
// on <html>, set only where navigator.userAgentData exists (Chromium-only API,
// absent from iOS Chrome, which runs WebKit). Everywhere else the material
// renders without refraction. Setting the flag from an effect runs after
// paint, which ADR 0003 rejected for persona colors; here the only cost is
// the first frame drawing glass without refraction, so it is accepted.
export function LiquidGlassFilter() {
  useEffect(() => {
    if ('userAgentData' in navigator) {
      document.documentElement.dataset.glassRefraction = '';
    }
  }, []);

  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <filter
        id="liquid-glass-refraction"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008"
          numOctaves="2"
          seed="7"
          result="noise"
        />
        <feGaussianBlur in="noise" stdDeviation="2" result="map" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          scale="36"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
