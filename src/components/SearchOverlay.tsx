import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { productImages, CartItem } from '../data/products';
import type { ProductDetail } from './ProductDetailModal';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick?: (p: ProductDetail) => void;
}

const SUGGESTIONS = [
  { q: 'پیراهن مجلسی', en: 'Evening Gown' },
  { q: 'لباس شب',      en: 'Night Dress'  },
  { q: 'ست مجلسی',    en: 'Formal Set'   },
  { q: 'لباس عروس',   en: 'Bridal'       },
];

export default function SearchOverlay({ isOpen, onClose, onProductClick }: SearchOverlayProps) {
  const { t, dir } = useLanguage();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  const products = t.bestsellers.products;

  const filtered = query
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes(p.category.toLowerCase())
      )
    : [];

  const showAll = query.length >= 1 && filtered.length === 0;
  const displayProducts = filtered.length > 0 ? filtered : (showAll ? products : []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(247, 244, 239, 0.97)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-center justify-between px-6 md:px-16 py-6 border-b border-stone-warm">
        <span className="logo-shimmer font-nastaliq text-2xl" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
          EvaQueen
        </span>
        <button onClick={onClose} className="text-soft-gray hover:text-gold transition-colors duration-300" aria-label={t.auth.close}>
          <X size={24} />
        </button>
      </div>

      <div className="px-6 md:px-16 py-10 flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 border-b-2 border-soft-black pb-3 mb-8">
            <Search size={20} className="text-soft-gray flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search + '...'}
              className="flex-1 bg-transparent text-xl text-soft-black outline-none placeholder:text-soft-gray/40"
              autoFocus
              aria-label={t.search}
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-soft-gray hover:text-gold transition-colors">
                <X size={16} />
              </button>
            )}
          </div>

          {!query && (
            <div>
              <p className="text-caption text-soft-gray tracking-[0.2em] mb-4">POPULAR SEARCHES</p>
              <div className="flex flex-wrap gap-3 mb-8">
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
              <p className="text-caption text-soft-gray tracking-[0.2em] mb-4">FEATURED</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.slice(0, 4).map((p, i) => (
                  <ProductResult
                    key={i}
                    index={i}
                    product={p}
                    image={productImages[i]}
                    onClick={() => {
                      onClose();
                      onProductClick?.({ id: i + 1, name: p.name, price: p.price, category: p.category, image: productImages[i] });
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {query && (
            <div>
              <p className="text-caption text-soft-gray tracking-[0.2em] mb-4">
                {filtered.length > 0
                  ? `${filtered.length} ${dir === 'rtl' ? 'نتیجه' : 'results'}`
                  : (dir === 'rtl' ? 'همه محصولات' : 'ALL PRODUCTS')}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {displayProducts.map((p, i) => (
                  <ProductResult
                    key={i}
                    index={i}
                    product={p}
                    image={productImages[i]}
                    onClick={() => {
                      onClose();
                      onProductClick?.({ id: i + 1, name: p.name, price: p.price, category: p.category, image: productImages[i] });
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductResult({
  product, image, index, onClick,
}: {
  product: { name: string; price: string; category: string };
  image: string;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-start group"
      style={{ animation: `fadeIn 0.4s ease ${index * 0.08}s both` }}
    >
      <div className="aspect-[3/4] overflow-hidden relative mb-2">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-soft-black/0 group-hover:bg-soft-black/15 transition-colors duration-300" />
      </div>
      <p className="text-xs font-medium text-soft-black leading-tight">{product.name}</p>
      <p className="font-en text-xs mt-0.5" style={{ color: '#BFA36A' }}>{product.price}</p>
    </button>
  );
}
