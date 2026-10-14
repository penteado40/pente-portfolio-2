import { ImageResponse } from 'next/og';
import type { PersonaId } from '@/content/personas';
import { SITE_NAME, SITE_URL } from '@/content/seo';

export const OG_SIZE = { width: 1200, height: 630 };

// ImageResponse can't read CSS variables, so these mirror the brand tokens
// and each persona's --persona-gradient in globals.css; keep in sync by hand.
const ONYX = '#141414';
const OFFWHITE = '#f5f5f5';

const PERSONA_COLORS: Record<PersonaId, { gradient: string; highlight: string }> = {
  audio: {
    gradient: 'linear-gradient(135deg, #000, #004a6b, #00638e, #8cb9cc)',
    highlight: '#bfd8e3',
  },
  dev: {
    gradient: 'linear-gradient(135deg, #000, #0f3f3f, #b6d298, #dce2c8)',
    highlight: '#b6d298',
  },
};

type OgImageProps = {
  /** A persona gets its gradient and highlight; without one, the Hub stays neutral. */
  persona?: PersonaId;
  /** The persona's role, or the Hub's tagline. Always in English: the image is static. */
  subtitle: string;
};

// Onyx with the persona's gradient as a panel on the right, the name and the
// role on the left. Uses ImageResponse's bundled font (Geist), like the site.
export function ogImage({ persona, subtitle }: OgImageProps) {
  const colors = persona ? PERSONA_COLORS[persona] : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: ONYX,
          color: OFFWHITE,
          padding: 56,
          gap: 56,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px 0',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ fontSize: 88, lineHeight: 1, letterSpacing: '-0.045em' }}>
              {SITE_NAME}
            </div>
            <div
              style={{
                fontSize: colors ? 44 : 34,
                lineHeight: 1.3,
                color: colors ? colors.highlight : OFFWHITE,
                opacity: colors ? 1 : 0.72,
              }}
            >
              {subtitle}
            </div>
          </div>
          <div style={{ fontSize: 22, letterSpacing: '0.14em', opacity: 0.55 }}>
            {new URL(SITE_URL).host.toUpperCase()}
          </div>
        </div>
        {colors && (
          <div
            style={{
              width: 360,
              borderRadius: 32,
              backgroundImage: colors.gradient,
            }}
          />
        )}
      </div>
    ),
    OG_SIZE,
  );
}
