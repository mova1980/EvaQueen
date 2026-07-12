import { getAssetPath } from '../config/assets.config';

interface LogoProps {
  variant?: 'dark' | 'light' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showWordmark?: boolean;
}

const LOGO_SRC = getAssetPath('logo', 'evaqueen-logo.png');

const dimensions = {
  sm: { h: 88, fontSize: 32, tracking: 10, gap: 24 },
  md: { h: 112, fontSize: 40, tracking: 12, gap: 28 },
  lg: { h: 144, fontSize: 52, tracking: 14, gap: 32 },
  xl: { h: 180, fontSize: 64, tracking: 18, gap: 40 },
};

export default function EvaQueenLogo({
  variant = 'dark',
  size = 'md',
  className = '',
  showWordmark = true,
}: LogoProps) {
  const d = dimensions[size];
  const uid = `eq-${size}-${variant}`;

  const goldMid = '#BFA36A';
  const goldEnd = '#9A8250';
  const shine = '#F5E4B0';

  const filter =
    variant === 'light'
      ? 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(247,244,239,0.4))'
      : variant === 'gold'
      ? `drop-shadow(0 0 12px rgba(191,163,106,0.5))`
      : `drop-shadow(0 0 6px rgba(191,163,106,0.25))`;

  const textFill =
    variant === 'light'
      ? 'rgba(247,244,239,0.92)'
      : variant === 'gold'
      ? `url(#${uid}-shimmer)`
      : `url(#${uid}-text-shimmer)`;

  return (
    <div className={`inline-flex items-center ${className}`} style={{ gap: d.gap }}>
      {/* Logo image with shine sweep */}
      <div
        className="relative"
        style={{
          height: `${d.h}px`,
          width: `${d.h}px`,
          flexShrink: 0,
          overflow: 'hidden',
          borderRadius: '4px',
        }}
      >
        <img
          src={LOGO_SRC}
          alt="EvaQueen Logo"
          className="w-full h-full object-contain eq-logo-img"
          style={{
            filter,
            transition: 'filter 0.4s ease, transform 0.6s ease',
          }}
        />
        {/* Shine sweep overlay */}
        <div
          className="absolute inset-0 pointer-events-none eq-logo-shine"
          style={{
            background:
              'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
            transform: 'translateX(-120%)',
          }}
        />
      </div>

      {showWordmark && (
        <>
          {/* Thin gold separator */}
          <div
            style={{
              width: '1px',
              height: `${d.h * 0.55}px`,
              background: `linear-gradient(to bottom, transparent, ${goldMid}, transparent)`,
              opacity: 0.5,
              flexShrink: 0,
            }}
          />

          {/* Wordmark — pure SVG for precise gradient */}
          <svg
            height={d.h}
            viewBox={`0 0 ${d.fontSize * 9.5 + d.tracking * 8} ${d.h}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="EvaQueen"
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Dark → gold → dark shimmer */}
              <linearGradient id={`${uid}-text-shimmer`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4A4540" />
                <stop offset="30%" stopColor="#181818" />
                <stop offset="48%" stopColor={goldMid} />
                <stop offset="50%" stopColor={shine} />
                <stop offset="52%" stopColor={goldMid} />
                <stop offset="70%" stopColor="#181818" />
                <stop offset="100%" stopColor="#4A4540" />
                <animate
                  attributeName="x1"
                  values="-200%;200%"
                  dur="5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="x2"
                  values="-100%;300%"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </linearGradient>

              {/* Gold shimmer variant */}
              <linearGradient id={`${uid}-shimmer`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={goldEnd} />
                <stop offset="35%" stopColor={goldMid} />
                <stop offset="50%" stopColor={shine} />
                <stop offset="65%" stopColor={goldMid} />
                <stop offset="100%" stopColor={goldEnd} />
                <animate
                  attributeName="x1"
                  values="-200%;200%"
                  dur="4s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="x2"
                  values="-100%;300%"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </linearGradient>
            </defs>

            <text
              y={d.h * 0.62}
              fontFamily="'Steiner', 'DM Sans', sans-serif"
              fontWeight="300"
              fontSize={d.fontSize}
              letterSpacing={d.tracking}
              fill={textFill}
            >
              EVAQUEEN
            </text>
          </svg>
        </>
      )}
    </div>
  );
}
