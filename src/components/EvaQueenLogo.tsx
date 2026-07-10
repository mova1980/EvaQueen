interface LogoProps {
  variant?: 'dark' | 'light' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showWordmark?: boolean;
}

const dimensions = {
  sm: { svgW: 38, svgH: 34, fontSize: 11, tracking: 4, gap: 10 },
  md: { svgW: 44, svgH: 40, fontSize: 13, tracking: 5, gap: 12 },
  lg: { svgW: 56, svgH: 50, fontSize: 16, tracking: 6, gap: 15 },
  xl: { svgW: 72, svgH: 64, fontSize: 20, tracking: 8, gap: 18 },
};

export default function EvaQueenLogo({
  variant = 'dark',
  size = 'md',
  className = '',
  showWordmark = true,
}: LogoProps) {
  const d = dimensions[size];
  const uid = `eq-${size}-${variant}`;

  const goldStart = '#D4BC8A';
  const goldMid = '#BFA36A';
  const goldEnd = '#9A8250';
  const shine = '#F5E4B0';

  const textFill =
    variant === 'light'
      ? 'rgba(247,244,239,0.92)'
      : variant === 'gold'
      ? `url(#${uid}-shimmer)`
      : `url(#${uid}-text-shimmer)`;

  return (
    <div className={`inline-flex items-center ${className}`} style={{ gap: d.gap }}>
      {/* Crown SVG Mark */}
      <svg
        width={d.svgW}
        height={d.svgH}
        viewBox="0 0 56 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id={`${uid}-crown`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={goldStart} />
            <stop offset="50%" stopColor={goldMid} />
            <stop offset="100%" stopColor={goldEnd} />
          </linearGradient>
          <linearGradient id={`${uid}-crown-v`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={shine} />
            <stop offset="60%" stopColor={goldMid} />
            <stop offset="100%" stopColor={goldEnd} />
          </linearGradient>
          <filter id={`${uid}-glow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.75  0 0 0 0 0.64  0 0 0 0 0.42  0 0 0 0.45 0"
              result="col"
            />
            <feMerge>
              <feMergeNode in="col" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Crown outline ─── */}
        <g filter={`url(#${uid}-glow)`}>
          {/* Main crown silhouette — 3 elegant points */}
          <path
            d="M 4 38
               L 4 22
               L 14 30
               L 28 8
               L 42 30
               L 52 22
               L 52 38
               Z"
            stroke={`url(#${uid}-crown-v)`}
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          />

          {/* Base line accent */}
          <line
            x1="4" y1="38" x2="52" y2="38"
            stroke={`url(#${uid}-crown)`}
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Center apex gem — diamond shape */}
          <path
            d="M 28 8 L 31 13 L 28 18 L 25 13 Z"
            fill={`url(#${uid}-crown-v)`}
          />

          {/* Left peak dot */}
          <circle cx="4" cy="22" r="2.2" fill={`url(#${uid}-crown)`} />
          {/* Right peak dot */}
          <circle cx="52" cy="22" r="2.2" fill={`url(#${uid}-crown)`} />

          {/* Inner left accent line */}
          <line
            x1="14" y1="30" x2="19" y2="38"
            stroke={`url(#${uid}-crown)`}
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.5"
          />
          {/* Inner right accent line */}
          <line
            x1="42" y1="30" x2="37" y2="38"
            stroke={`url(#${uid}-crown)`}
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
      </svg>

      {showWordmark && (
        <>
          {/* Thin gold separator */}
          <div
            style={{
              width: '1px',
              height: `${d.svgH * 0.55}px`,
              background: `linear-gradient(to bottom, transparent, ${goldMid}, transparent)`,
              opacity: 0.5,
              flexShrink: 0,
            }}
          />

          {/* Wordmark — pure SVG for precise gradient */}
          <svg
            height={d.svgH}
            viewBox={`0 0 ${d.fontSize * 9.5 + d.tracking * 8} ${d.svgH}`}
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
              y={d.svgH * 0.62}
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
