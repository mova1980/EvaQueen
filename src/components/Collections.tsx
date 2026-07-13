import { useRef, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { collectionImages } from '../data/products';
import type { CollectionDetail } from './CollectionDetailModal';

interface CollectionsProps {
  onCollectionClick: (c: CollectionDetail) => void;
}

export default function Collections({ onCollectionClick }: CollectionsProps) {
  const { t, dir } = useLanguage();
  const [titleRef, titleVisible] = useIntersectionObserver(0.15);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [maxScroll, setMaxScroll] = useState(1);

  useEffect(() => {
    if (scrollRef.current) {
      setMaxScroll(scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
    }
  }, []);

  const scroll = (direction: 'next' | 'prev') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.88;
    scrollRef.current.scrollBy({
      left: direction === 'next'
        ? (dir === 'rtl' ? -amount : amount)
        : (dir === 'rtl' ? amount : -amount),
      behavior: 'smooth',
    });
  };

  const progressPct = maxScroll > 0 ? Math.min(100, (scrollPos / maxScroll) * 100) : 0;

  return (
    <section id="collections" className="py-24 bg-ivory-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef as React.RefObject<HTMLDivElement>} className="mb-16 flex items-end justify-between gap-6">
          <div>
            <span className={`text-caption text-gold tracking-[0.28em] block mb-3 fade-in-up ${titleVisible ? 'visible' : ''}`}>COLLECTIONS</span>
            <h2 className={`text-headline text-soft-black fade-in-up delay-1 ${titleVisible ? 'visible' : ''}`}>{t.collections.title}</h2>
            <p className={`text-body-lg text-soft-gray mt-3 max-w-md fade-in-up delay-2 ${titleVisible ? 'visible' : ''}`}>{t.collections.subtitle}</p>
          </div>
          <div className={`hidden md:flex gap-3 flex-shrink-0 fade-in-up delay-3 ${titleVisible ? 'visible' : ''}`}>
            <button onClick={() => scroll('prev')} className="w-11 h-11 border border-stone-warm rounded-full flex items-center justify-center text-soft-gray hover:border-gold hover:text-gold hover:scale-105 transition-all duration-300" aria-label="قبلی">
              {dir === 'rtl' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            </button>
            <button onClick={() => scroll('next')} className="w-11 h-11 border border-stone-warm rounded-full flex items-center justify-center text-soft-gray hover:border-gold hover:text-gold hover:scale-105 transition-all duration-300" aria-label="بعدی">
              {dir === 'rtl' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="horizontal-scroll flex gap-5 pb-6"
        style={{ paddingLeft: 'max(24px, calc((100vw - 1280px) / 2 + 24px))', paddingRight: '24px' }}
        onScroll={(e) => setScrollPos((e.target as HTMLElement).scrollLeft)}
      >
        {t.collections.items.map((item, i) => (
          <CollectionCard
            key={i}
            item={item}
            image={collectionImages[i]}
            index={i}
            onClick={() => onCollectionClick({ index: i, name: item.name, desc: item.desc, image: collectionImages[i] })}
          />
        ))}
        <div className="flex-shrink-0 w-4" />
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex items-center gap-4">
          <span className="font-en text-xs text-soft-gray/60">01</span>
          <div className="flex-1 h-px bg-stone-warm rounded-full overflow-hidden">
            <div className="h-full bg-gold transition-all duration-300 rounded-full" style={{ width: `${Math.max(8, progressPct)}%` }} />
          </div>
          <span className="font-en text-xs text-soft-gray/60">0{t.collections.items.length}</span>
        </div>
      </div>
    </section>
  );
}

function CollectionCard({
  item, image, index, onClick,
}: {
  item: { name: string; desc: string };
  image: string;
  index: number;
  onClick: () => void;
}) {
  const [ref, visible] = useIntersectionObserver(0.1);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="h-snap-item flex-shrink-0 relative group cursor-pointer collection-card"
      style={{
        width: 'clamp(300px, 40vw, 520px)',
        height: 'clamp(440px, 62vh, 680px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
        transition: `opacity 1s ease ${index * 0.18}s, transform 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.18}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`مشاهده مجموعه ${item.name}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img src={image} alt={item.name} className="w-full h-full object-cover object-top transition-transform duration-1000" style={{ transform: hovered ? 'scale(1.07)' : 'scale(1)' }} loading="lazy" />
      </div>
      <div className="absolute inset-0 transition-opacity duration-500" style={{ background: 'linear-gradient(to top, rgba(24,24,24,0.85) 0%, rgba(24,24,24,0.15) 45%, transparent 100%)', opacity: hovered ? 1 : 0.85 }} />
      <div className="absolute inset-0 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, rgba(191,163,106,0.08) 0%, transparent 70%)', opacity: hovered ? 1 : 0 }} />
      <div className="absolute top-5 left-5 w-8 h-8 border-t border-l transition-all duration-500" style={{ borderColor: hovered ? 'rgba(191,163,106,0.6)' : 'rgba(191,163,106,0)' }} />
      <div className="absolute top-5 right-5 w-8 h-8 border-t border-r transition-all duration-500" style={{ borderColor: hovered ? 'rgba(191,163,106,0.6)' : 'rgba(191,163,106,0)' }} />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <span className="font-en text-xs text-gold/75 tracking-[0.25em] block mb-2">0{index + 1}</span>
        <h3 className="font-en text-xl font-light text-white mb-2 tracking-[0.06em] transition-colors duration-300" style={{ color: hovered ? '#F0D898' : 'rgba(247,244,239,0.97)' }}>{item.name}</h3>
        <p className="text-xs text-white/55 mb-5 leading-relaxed">{item.desc}</p>
        <div className="flex items-center gap-3" style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.4s ease 0.1s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s' }}>
          <div className="h-px w-8 bg-gold" />
          <span className="text-caption text-gold tracking-[0.2em]">EXPLORE</span>
        </div>
      </div>
      <div className="absolute top-8 end-8 font-en text-5xl font-bold pointer-events-none select-none" style={{ color: 'rgba(247,244,239,0.04)' }} aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </div>
    </div>
  );
}
