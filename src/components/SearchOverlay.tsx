import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteData, Product } from '../contexts/SiteDataContext';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick?: (p: Product) => void;
}

export default function SearchOverlay({ isOpen, onClose, onProductClick }: SearchOverlayProps) {
  const { t, dir } = useLanguage();
  const { products } = useSiteData();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  const isRtl = dir === 'rtl';
  const getName = (p: Product) => (isRtl ? p.name : (p.name_en || p.name));
  const getPrice = (p: Product) => (isRtl ? p.price : (p.price_en || p.price));
  const getCategory = (p: Product) => (isRtl ? p.category : (p.category_en || p.category));

  const published = products.filter((p) => p.status === 'published');

  const filtered = query
    ? published.filter((p) => {
        const name = getName(p).toLowerCase();
        const cat = getCategory(p).toLowerCase();
        const q = query.toLowerCase();
        return name.includes(q) || cat.includes(q) || q.includes(cat);
      })
    : [];

  const displayProducts = filtered.length > 0 ? filtered : (query.length >= 1 ? published : published.slice(0, 4));

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(247, 244, 239, 0.97)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-center justify-between px-6 md:px-16 py-6 border-b border-stone-warm">
        <span className="font-en text-xl font-bold tracking-widest" style={{ color: '#BFA36A' }}>
          EVAQUEEN
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
              <p className="text-caption text-soft-gray tracking-[0.2em] mb-4">FEATURED</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {published.slice(0, 4).map((p, i) => (
                  <ProductResult
                    key={p.id}
                    index={i}
                    name={getName(p)}
                    price={getPrice(p)}
                    category={getCategory(p)}
                    image={p.image}
                    onClick={() => {
                      onClose();
                      onProductClick?.(p);
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
                  ? `${filtered.length} ${isRtl ? 'نتیجه' : 'results'}`
                  : (isRtl ? 'همه محصولات' : 'ALL PRODUCTS')}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {displayProducts.map((p, i) => (
                  <ProductResult
                    key={p.id}
                    index={i}
                    name={getName(p)}
                    price={getPrice(p)}
                    category={getCategory(p)}
                    image={p.image}
                    onClick={() => {
                      onClose();
                      onProductClick?.(p);
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
  name, price, image, index, onClick,
}: {
  name: string;
  price: string;
  category: string;
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
          alt={name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-soft-black/0 group-hover:bg-soft-black/15 transition-colors duration-300" />
      </div>
      <p className="text-xs font-medium text-soft-black leading-tight">{name}</p>
      <p className="font-en text-xs mt-0.5" style={{ color: '#BFA36A' }}>{price}</p>
    </button>
  );
}
