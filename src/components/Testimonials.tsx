import { useState, useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export default function Testimonials() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const [sectionRef, visible] = useIntersectionObserver(0.2);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % t.testimonials.items.length);
    }, 5000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [t.testimonials.items.length]);

  const goTo = (i: number) => {
    setActive(i);
    startAutoPlay();
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-24 bg-ivory-100 relative overflow-hidden"
    >
      {/* Decorative quote mark */}
      <div
        className="absolute top-12 start-12 text-gold/5 pointer-events-none"
        aria-hidden="true"
      >
        <Quote size={120} />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <span
            className={`text-caption text-gold tracking-[0.25em] block mb-3 fade-in-up ${visible ? 'visible' : ''}`}
          >
            TESTIMONIALS
          </span>
          <h2
            className={`text-headline text-soft-black fade-in-up delay-1 ${visible ? 'visible' : ''}`}
          >
            {t.testimonials.title}
          </h2>
          <div className={`gold-divider fade-in-up delay-2 ${visible ? 'visible' : ''}`} />
        </div>

        {/* Testimonial cards */}
        <div className="relative h-auto min-h-[320px] md:min-h-[280px]">
          {t.testimonials.items.map((item, i) => (
            <div
              key={i}
              className="absolute inset-0 flex flex-col items-center text-center px-4"
              style={{
                opacity: i === active ? 1 : 0,
                transform: i === active ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.98)',
                transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                pointerEvents: i === active ? 'auto' : 'none',
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: item.rating }).map((_, si) => (
                  <Star key={si} size={16} className="text-gold fill-gold" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-title text-soft-black font-light leading-relaxed max-w-2xl mb-8">
                "{item.text}"
              </blockquote>

              {/* Author */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-stone-warm border-2 border-gold/30 flex items-center justify-center mb-2">
                  <span className="text-soft-gray font-semibold text-sm">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <span className="font-semibold text-soft-black text-sm">{item.name}</span>
                <span className="text-caption text-soft-gray tracking-wider">{item.location}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dots navigation */}
        <div className="flex justify-center gap-3 mt-8">
          {t.testimonials.items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-400 rounded-full"
              style={{
                width: i === active ? '28px' : '8px',
                height: '8px',
                background: i === active ? 'var(--accent-gold)' : 'var(--bg-secondary)',
              }}
              aria-label={`نظر ${i + 1}`}
              aria-pressed={i === active}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
