import {} from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { philosophyImage } from '../data/products';

export default function Philosophy() {
  const { t, dir } = useLanguage();
  const [sectionRef, visible] = useIntersectionObserver(0.2);
  const [quoteRef, quoteVisible] = useIntersectionObserver(0.25);
  const [imgRef, imgVisible] = useIntersectionObserver(0.15);

  return (
    <section
      id="philosophy"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="min-h-screen flex items-center py-24 bg-ivory-100 relative overflow-hidden"
    >
      {/* Decorative BG number */}
      <div
        className="absolute top-1/2 -translate-y-1/2 start-0 section-number pointer-events-none"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 2s ease 0.5s',
        }}
        aria-hidden="true"
      >
        02
      </div>

      {/* Radial gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 65% 50%, rgba(191,163,106,0.045) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Text side */}
        <div className={dir === 'rtl' ? 'order-2 lg:order-1' : 'order-1'}>
          {/* Label */}
          <div
            className={`cinematic-reveal ${visible ? 'revealed' : ''} mb-7`}
            style={{ transitionDelay: '0.1s' }}
          >
            <div className="flex items-center gap-4">
              <div className="h-px w-10" style={{ background: 'var(--accent-gold)' }} />
              <span className="text-caption text-gold tracking-[0.28em]">
                {t.philosophy.label.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Quote */}
          <div
            ref={quoteRef as React.RefObject<HTMLDivElement>}
            className={`cinematic-reveal ${quoteVisible ? 'revealed' : ''} mb-10`}
            style={{ transitionDelay: '0.28s' }}
          >
            <blockquote
              className="text-title text-soft-black leading-loose font-light"
              style={{ fontStyle: 'normal' }}
            >
              <span
                className="inline-block font-nastaliq text-4xl leading-none me-2 align-middle"
                style={{ color: 'var(--accent-gold)', fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 1 }}
                aria-hidden="true"
              >
                "
              </span>
              {t.philosophy.text}
              <span
                className="inline-block font-nastaliq text-4xl leading-none ms-1 align-middle"
                style={{ color: 'var(--accent-gold)', fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 1 }}
                aria-hidden="true"
              >
                „
              </span>
            </blockquote>
          </div>

          {/* Signature */}
          <div
            className={`cinematic-reveal ${quoteVisible ? 'revealed' : ''}`}
            style={{ transitionDelay: '0.55s' }}
          >
            <div className="flex items-center gap-4">
              <div className="h-px w-14" style={{ background: 'var(--bg-secondary)' }} />
              <div>
                <div className="font-en text-xs text-soft-gray tracking-[0.2em] uppercase">
                  {t.philosophy.signature}
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div
            className={`mt-12 grid grid-cols-3 gap-6 fade-in-up delay-4 ${visible ? 'visible' : ''}`}
          >
            {[
              { num: '+5K', label: dir === 'rtl' ? 'مشتری راضی' : 'Happy Clients' },
              { num: '2026', label: dir === 'rtl' ? 'مجموعه جدید' : 'New Collection' },
              { num: '100%', label: dir === 'rtl' ? 'اصالت ایرانی' : 'Authentic Craft' },
            ].map((s) => (
              <div key={s.num} className="text-center">
                <div
                  className="font-en font-bold mb-1"
                  style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: 'var(--accent-gold)' }}
                >
                  {s.num}
                </div>
                <div className="text-caption text-soft-gray">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Image side */}
        <div
          ref={imgRef as React.RefObject<HTMLDivElement>}
          className={dir === 'rtl' ? 'order-1 lg:order-2' : 'order-2'}
        >
          <div
            style={{
              opacity: imgVisible ? 1 : 0,
              transform: imgVisible ? 'translateX(0)' : `translateX(${dir === 'rtl' ? '-40px' : '40px'})`,
              transition: 'opacity 1.2s ease 0.2s, transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
            }}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={philosophyImage}
                alt="فلسفه EvaQueen"
                className="w-full h-full object-cover object-top transition-transform duration-1000 hover:scale-105"
                loading="lazy"
              />
              {/* Gold frame inset */}
              <div
                className="absolute pointer-events-none"
                style={{
                  inset: '20px',
                  border: '1px solid rgba(191,163,106,0.25)',
                }}
              />
              {/* Bottom caption overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 p-6"
                style={{ background: 'linear-gradient(to top, rgba(24,24,24,0.75) 0%, transparent 100%)' }}
              >
                <div className="text-caption text-gold/80 tracking-[0.2em] mb-1">EVAQUEEN</div>
                <div className="text-white/90 text-sm font-light">Collection 2026</div>
              </div>
            </div>

            {/* Floating accent card */}
            <div
              className="absolute -bottom-6 -start-6 bg-ivory-100 border border-stone-warm p-5 shadow-luxury max-w-[180px]"
              style={{
                opacity: imgVisible ? 1 : 0,
                transform: imgVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 1s ease 0.7s, transform 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s',
              }}
            >
              <div
                className="font-en font-bold mb-0.5"
                style={{ fontSize: '2rem', color: 'var(--accent-gold)', lineHeight: 1 }}
              >
                2026
              </div>
              <div className="text-caption text-soft-gray tracking-wider">NEW SEASON</div>
              <div
                className="mt-3 h-px w-full"
                style={{ background: 'linear-gradient(to right, var(--accent-gold), transparent)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
