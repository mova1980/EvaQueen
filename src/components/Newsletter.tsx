import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export default function Newsletter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sectionRef, visible] = useIntersectionObserver(0.2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section
      id="newsletter"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-24 bg-ivory-200"
    >
      <div className="max-w-3xl mx-auto px-6">
        <div
          className={`border border-gold/30 p-12 md:p-16 relative overflow-hidden fade-in-up ${visible ? 'visible' : ''}`}
          style={{ background: 'var(--bg-secondary)' }}
        >
          {/* Gold accent corners */}
          <div className="absolute top-0 start-0 w-8 h-8 border-t-2 border-s-2 border-gold" />
          <div className="absolute top-0 end-0 w-8 h-8 border-t-2 border-e-2 border-gold" />
          <div className="absolute bottom-0 start-0 w-8 h-8 border-b-2 border-s-2 border-gold" />
          <div className="absolute bottom-0 end-0 w-8 h-8 border-b-2 border-e-2 border-gold" />

          {/* Background radial */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(191,163,106,0.06) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 text-center">
            {/* Crown icon / decorative */}
            <div className="mb-6 flex justify-center">
              <div className="w-14 h-14 border border-gold/40 rounded-full flex items-center justify-center">
                <span
                  className="logo-shimmer font-nastaliq text-xl"
                  style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
                >
                  EQ
                </span>
              </div>
            </div>

            <h2
              className={`text-headline text-soft-black mb-4 fade-in-up delay-1 ${visible ? 'visible' : ''}`}
            >
              {t.newsletter.title}
            </h2>
            <p
              className={`text-body-lg text-soft-gray mb-10 max-w-lg mx-auto fade-in-up delay-2 ${visible ? 'visible' : ''}`}
            >
              {t.newsletter.subtitle}
            </p>

            {submitted ? (
              <div
                className="flex flex-col items-center gap-4"
                style={{ animation: 'fadeIn 0.6s ease forwards' }}
              >
                <CheckCircle size={48} className="text-gold" />
                <p className="text-soft-black font-medium">
                  {t.newsletter.title} ✓
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className={`flex flex-col sm:flex-row gap-4 max-w-md mx-auto fade-in-up delay-3 ${visible ? 'visible' : ''}`}
              >
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.newsletter.placeholder}
                    required
                    className="luxury-input text-sm"
                    aria-label={t.newsletter.placeholder}
                  />
                </div>
                <button type="submit" className="btn-primary text-sm tracking-widest whitespace-nowrap">
                  <span>{t.newsletter.cta}</span>
                </button>
              </form>
            )}

            <p
              className={`mt-5 text-xs text-soft-gray/60 tracking-wider fade-in-up delay-4 ${visible ? 'visible' : ''}`}
            >
              {t.newsletter.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
