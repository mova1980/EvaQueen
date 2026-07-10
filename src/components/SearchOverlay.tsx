import { useState, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { productImages } from '../data/products';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  { q: 'پیراهن مجلسی', en: 'Evening Gown' },
  { q: 'لباس شب', en: 'Night Dress' },
  { q: 'ست مجلسی', en: 'Formal Set' },
  { q: 'لباس عروس', en: 'Bridal' },
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(247, 244, 239, 0.97)', backdropFilter: 'blur(12px)' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 md:px-16 py-6 border-b border-stone-warm">
        <span
          className="logo-shimmer font-nastaliq text-2xl"
          style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
        >
          EvaQueen
        </span>
        <button
          onClick={onClose}
          className="text-soft-gray hover:text-gold transition-colors duration-300"
          aria-label={t.auth.close}
        >
          <X size={24} />
        </button>
      </div>

      {/* Search input */}
      <div className="px-6 md:px-16 py-10 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 border-b-2 border-soft-black pb-3 mb-8">
            <Search size={20} className="text-soft-gray flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search + '...'}
              className="flex-1 bg-transparent text-xl text-soft-black outline-none placeholder:text-soft-gray/40"
              autoFocus
              aria-label={t.search}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-soft-gray hover:text-gold transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Suggestions */}
          {!query && (
            <div>
              <p className="text-caption text-soft-gray tracking-[0.2em] mb-4">
                POPULAR SEARCHES
              </p>
              <div className="flex flex-wrap gap-3">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.q}
                    onClick={() => setQuery(s.q)}
                    className="border border-stone-warm px-4 py-2 text-sm text-soft-gray hover:border-gold hover:text-gold transition-all duration-300"
                  >
                    {s.q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick results preview */}
          {query && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {productImages.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] overflow-hidden cursor-pointer group relative"
                  style={{
                    opacity: 0,
                    animation: `fadeIn 0.4s ease ${i * 0.1}s forwards`,
                  }}
                >
                  <img
                    src={img}
                    alt="result"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-soft-black/0 group-hover:bg-soft-black/20 transition-colors duration-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
