import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getAssetPath } from '../config/assets.config';

const HERO_SLIDES = [
  {
    src: getAssetPath('image', 'homepage/hero-1.jpg'),
    position: 'center 20%',
    ken: 'kenBurnsA',
  },
  {
    src: getAssetPath('image', 'homepage/hero-2.jpg'),
    position: 'center top',
    ken: 'kenBurnsB',
  },
  {
    src: getAssetPath('image', 'homepage/hero-3.jpg'),
    position: 'center 15%',
    ken: 'kenBurnsC',
  },
];

const FASHION_VIDEO_SRC = getAssetPath('video', 'promo/fashion-show.mp4');
const FASHION_VIDEO_POSTER = getAssetPath('video', 'promo/fashion-poster.jpg');

const SLIDE_DURATION = 5500;

const PARTICLES = [
  { left: 8,  size: 2.5, delay: 0,   dur: 9   },
  { left: 16, size: 1.5, delay: 2.1, dur: 7.5 },
  { left: 24, size: 3,   delay: 1.0, dur: 8   },
  { left: 33, size: 2,   delay: 3.5, dur: 10  },
  { left: 41, size: 1.5, delay: 0.5, dur: 7   },
  { left: 50, size: 2.5, delay: 4.2, dur: 9.5 },
  { left: 58, size: 2,   delay: 1.8, dur: 8.5 },
  { left: 66, size: 3,   delay: 2.7, dur: 7   },
  { left: 74, size: 1.5, delay: 0.3, dur: 9   },
  { left: 80, size: 2,   delay: 3.1, dur: 8   },
  { left: 87, size: 2.5, delay: 1.5, dur: 7.5 },
  { left: 93, size: 1.5, delay: 4.8, dur: 10  },
  { left: 11, size: 2,   delay: 5.2, dur: 8   },
  { left: 28, size: 1.5, delay: 3.8, dur: 9   },
  { left: 45, size: 3,   delay: 6.1, dur: 7   },
  { left: 62, size: 2,   delay: 2.4, dur: 8.5 },
  { left: 76, size: 1.5, delay: 5.7, dur: 9.5 },
  { left: 90, size: 2.5, delay: 0.9, dur: 7   },
];

const DIAGONALS = [
  { top: '28%', delay: 0,  dur: 14 },
  { top: '55%', delay: 5,  dur: 18 },
  { top: '72%', delay: 10, dur: 12 },
];

export default function Hero() {
  const { t, dir } = useLanguage();
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [textVisible, setTextVisible] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [countdownW, setCountdownW] = useState(100);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setTextVisible(true), 400);
    const t2 = setTimeout(() => setVideoVisible(true), 1400);

    intervalRef.current = setInterval(() => {
      setActive((cur) => {
        const next = (cur + 1) % HERO_SLIDES.length;
        setPrev(cur);
        return next;
      });
      setCountdownW(100);
    }, SLIDE_DURATION);

    countdownRef.current = setInterval(() => {
      setCountdownW((w) => Math.max(0, w - 100 / ((SLIDE_DURATION - 200) / 100)));
    }, 100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const goToSlide = (idx: number) => {
    setPrev(active);
    setActive(idx);
    setCountdownW(100);
  };

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: '600px' }}
    >
      {/* ── Background slides ── */}
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            opacity: i === active ? 1 : i === prev ? 0 : 0,
            transition: 'opacity 1200ms cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: i === active ? 1 : 0,
          }}
        >
          <img
            src={slide.src}
            alt={`EvaQueen 2026 Collection ${i + 1}`}
            className="w-full h-full object-cover"
            style={{
              objectPosition: slide.position,
              animation: i === active
                ? `${slide.ken} ${SLIDE_DURATION + 1200}ms ease-in-out forwards`
                : 'none',
            }}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* ── Gradient overlays ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/38 via-black/10 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/18 via-transparent to-black/10" />
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: 'linear-gradient(to top, #F7F4EF, transparent)' }}
        />
      </div>

      {/* ── Scan lines ── */}
      <div className="absolute inset-0 pointer-events-none scan-lines" style={{ zIndex: 3 }} />

      {/* ── Particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }}>
        {PARTICLES.map((p) => (
          <div
            key={`${p.left}-${p.delay}`}
            className="hero-particle absolute"
            style={{
              left: `${p.left}%`,
              bottom: '-4px',
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </div>

      {/* ── Diagonal gold sweeps ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }}>
        {DIAGONALS.map((d, i) => (
          <div
            key={i}
            className="hero-diagonal"
            style={{ top: d.top, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }}
          />
        ))}
      </div>

      {/* ── Animated corner frame ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '80px 48px',
          zIndex: 4,
          opacity: textVisible ? 1 : 0,
          transition: 'opacity 2s ease 1.5s',
        }}
      >
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l" style={{ borderColor: 'rgba(191,163,106,0.4)' }} />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r" style={{ borderColor: 'rgba(191,163,106,0.4)' }} />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l" style={{ borderColor: 'rgba(191,163,106,0.4)' }} />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r" style={{ borderColor: 'rgba(191,163,106,0.4)' }} />
      </div>

      {/* ── EQ watermark ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 4 }}>
        <span
          className="font-en font-bold select-none"
          style={{
            fontSize: 'clamp(10rem, 22vw, 20rem)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(191,163,106,0.04)',
            letterSpacing: '-0.05em',
            lineHeight: 1,
            opacity: textVisible ? 1 : 0,
            transition: 'opacity 3s ease 2s',
            transform: 'translateY(5%)',
          }}
          aria-hidden="true"
        >
          EQ
        </span>
      </div>

      {/* ── Hero text ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{
          zIndex: 5,
          // Shift text slightly away from the video panel side
          paddingRight: dir === 'rtl' ? '6px' : 'clamp(6px, 30vw, 380px)',
          paddingLeft:  dir === 'rtl' ? 'clamp(6px, 30vw, 380px)' : '6px',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 1.2s ease 0.8s, transform 1.2s ease 0.8s',
          }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, rgba(191,163,106,0.7))' }} />
            <span
              className="font-en tracking-[0.3em]"
              style={{ color: 'rgba(191,163,106,0.85)', fontSize: '10px', letterSpacing: '0.3em', fontWeight: 300 }}
            >
              EVAQUEEN — FORMAL & EVENING COLLECTION 2026
            </span>
            <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, rgba(191,163,106,0.7))' }} />
          </div>
        </div>

        {/* Line 1 */}
        <div className="overflow-hidden mb-3">
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
              fontWeight: 700,
              color: 'rgba(247,244,239,0.97)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              textShadow: '0 4px 60px rgba(0,0,0,0.4)',
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(70px)',
              transition: 'opacity 1.4s cubic-bezier(0.34,1.56,0.64,1) 1s, transform 1.4s cubic-bezier(0.34,1.56,0.64,1) 1s',
            }}
          >
            {t.hero.line1}
          </h1>
        </div>

        {/* Line 2 — gold */}
        <div className="overflow-hidden mb-12">
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#BFA36A',
              filter: 'drop-shadow(0 2px 24px rgba(191,163,106,0.4))',
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(70px)',
              transition: 'opacity 1.4s cubic-bezier(0.34,1.56,0.64,1) 1.25s, transform 1.4s cubic-bezier(0.34,1.56,0.64,1) 1.25s',
            }}
          >
            {t.hero.line2}
          </h1>
        </div>

        {/* CTA */}
        <div
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 1s ease 1.7s, transform 1s cubic-bezier(0.34,1.56,0.64,1) 1.7s',
          }}
        >
          <button
            onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative overflow-hidden font-en"
            style={{
              padding: '14px 40px',
              border: '1px solid rgba(191,163,106,0.55)',
              color: 'rgba(247,244,239,0.9)',
              background: 'rgba(0,0,0,0.15)',
              backdropFilter: 'blur(8px)',
              letterSpacing: '0.2em',
              fontSize: '12px',
              fontWeight: 300,
              transition: 'border-color 0.4s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#BFA36A')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(191,163,106,0.55)')}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(135deg, rgba(191,163,106,0.22), rgba(191,163,106,0.08))' }}
            />
            <span className="relative z-10">{t.hero.cta}</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════
          VIDEO PANEL — side showcase
         ══════════════════════════════ */}
      <div
        className={`hero-video-panel absolute hidden lg:block ${videoVisible ? 'visible' : 'hidden-initial'}`}
        style={{
          width: 'clamp(180px, 20vw, 300px)',
          right: dir === 'rtl' ? 'auto' : '40px',
          left: dir === 'rtl' ? '40px' : 'auto',
          opacity: videoVisible ? 1 : 0,
          transform: videoVisible
            ? 'translateY(-50%) translateX(0)'
            : `translateY(-50%) translateX(${dir === 'rtl' ? '-30px' : '30px'})`,
          transition: 'opacity 1.8s ease 1.4s, transform 1.8s cubic-bezier(0.34,1.56,0.64,1) 1.4s',
        }}
      >
        {/* Outer glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: '-16px',
            background: 'radial-gradient(ellipse at center, rgba(191,163,106,0.12) 0%, transparent 70%)',
            borderRadius: '2px',
          }}
        />

        {/* Gold corner frame — extends beyond video */}
        <div
          className="absolute pointer-events-none"
          style={{ inset: '-8px', zIndex: 10 }}
        >
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: 'rgba(191,163,106,0.7)' }} />
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: 'rgba(191,163,106,0.7)' }} />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: 'rgba(191,163,106,0.7)' }} />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: 'rgba(191,163,106,0.7)' }} />
          {/* Full thin border inside corners */}
          <div className="absolute inset-3 border pointer-events-none" style={{ borderColor: 'rgba(191,163,106,0.18)' }} />
        </div>

        {/* Video container */}
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '9/16',
            boxShadow: '0 24px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(191,163,106,0.2)',
          }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            src={FASHION_VIDEO_SRC}
            poster={FASHION_VIDEO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className="w-full h-full object-cover object-center"
            style={{ display: 'block' }}
            aria-label="EvaQueen 2026 Formal Collection — Video Showcase"
          />

          {/* Subtle scan-line overlay on video */}
          <div
            className="absolute inset-0 pointer-events-none scan-lines"
            style={{ opacity: 0.5 }}
          />

          {/* Top fade */}
          <div
            className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(24,24,24,0.5), transparent)' }}
          />

          {/* Bottom content overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(24,24,24,0.75) 0%, transparent 100%)' }}
          >
            <div
              className="font-en mb-0.5"
              style={{
                fontSize: '9px',
                letterSpacing: '0.28em',
                color: 'rgba(191,163,106,0.85)',
                fontWeight: 300,
              }}
            >
              EVAQUEEN
            </div>
            <div
              className="font-en"
              style={{ fontSize: '10px', color: 'rgba(247,244,239,0.65)', letterSpacing: '0.1em', fontWeight: 300 }}
            >
              Formal Collection 2026
            </div>
          </div>

          {/* Loading shimmer */}
          {!videoLoaded && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: '#181818' }}
            >
              <img
                src={FASHION_VIDEO_POSTER}
                alt="Loading"
                className="w-full h-full object-cover opacity-60"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(191,163,106,0.08) 50%, transparent 100%)',
                  animation: 'shimmerBg 1.5s ease infinite',
                }}
              />
            </div>
          )}
        </div>

        {/* "LIVE" / play indicator dot */}
        <div
          className="absolute top-2 left-3 flex items-center gap-1.5 z-10"
          style={{
            opacity: videoLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#BFA36A', animation: 'pulse 2s ease-in-out infinite' }}
          />
          <span
            className="font-en"
            style={{ fontSize: '8px', color: 'rgba(247,244,239,0.6)', letterSpacing: '0.2em', fontWeight: 300 }}
          >
            LIVE
          </span>
        </div>
      </div>

      {/* ── Slide indicators ── */}
      <div
        className="absolute bottom-20 flex items-center gap-4"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 6,
          opacity: textVisible ? 1 : 0,
          transition: 'opacity 1s ease 2s',
          // Shift away from video on desktop to avoid overlap
          marginRight: dir === 'rtl' ? 'clamp(0px, 18vw, 260px)' : '0',
          marginLeft: dir === 'rtl' ? '0' : 'clamp(0px, 18vw, 260px)',
        }}
      >
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Slide ${i + 1}`}
            className="relative overflow-hidden transition-all duration-500"
            style={{
              width: i === active ? '40px' : '6px',
              height: '2px',
              background: 'rgba(247,244,239,0.25)',
              borderRadius: '1px',
            }}
          >
            {i === active && (
              <span
                className="absolute inset-y-0 left-0"
                style={{ width: `${countdownW}%`, background: '#BFA36A', transition: 'width 0.1s linear', borderRadius: '1px' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Scroll cue ── */}
      <button
        onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute flex flex-col items-center gap-2"
        style={{
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 6,
          opacity: textVisible ? 0.55 : 0,
          transition: 'opacity 1s ease 2.2s, color 0.3s ease',
          color: 'rgba(247,244,239,0.7)',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#BFA36A')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(247,244,239,0.7)')}
        aria-label="Scroll down"
      >
        <span className="font-en" style={{ fontSize: '9px', letterSpacing: '0.25em', fontWeight: 300 }}>SCROLL</span>
        <div className="scroll-mouse">
          <div className="scroll-dot" />
        </div>
      </button>
    </section>
  );
}
