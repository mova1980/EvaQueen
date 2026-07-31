import { useState } from 'react';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteData, Product } from '../contexts/SiteDataContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { CartItem } from '../data/products';

interface BestSellersProps {
  onAddToCart: (item: CartItem) => void;
  onProductClick: (p: Product) => void;
}

export default function BestSellers({ onAddToCart, onProductClick }: BestSellersProps) {
  const { t, dir } = useLanguage();
  const { products, loading } = useSiteData();
  const [sectionRef, visible] = useIntersectionObserver(0.08);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const published = products.filter((p) => p.status === 'published');

  const isRtl = dir === 'rtl';
  const getName = (p: Product) => (isRtl ? p.name : (p.name_en || p.name));
  const getPrice = (p: Product) => (isRtl ? p.price : (p.price_en || p.price));
  const getCategory = (p: Product) => (isRtl ? p.category : (p.category_en || p.category));

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const gridClasses = ['md:row-span-2', 'md:row-span-1', 'md:row-span-1', 'md:row-span-2', 'md:row-span-1'];

  return (
    <section id="bestsellers" ref={sectionRef as React.RefObject<HTMLElement>} className="py-24 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 15% 80%, rgba(191,163,106,0.05) 0%, transparent 50%), radial-gradient(circle at 85% 20%, rgba(191,163,106,0.04) 0%, transparent 50%)' }} />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <span className={`text-caption text-gold tracking-[0.3em] block mb-3 fade-in-up ${visible ? 'visible' : ''}`}>BEST SELLERS</span>
          <h2 className={`text-headline text-soft-black fade-in-up delay-1 ${visible ? 'visible' : ''}`}>{t.bestsellers.title}</h2>
          <p className={`text-body-lg text-soft-gray mt-3 fade-in-up delay-2 ${visible ? 'visible' : ''}`}>{t.bestsellers.subtitle}</p>
          <div className={`gold-divider fade-in-up delay-3 ${visible ? 'visible' : ''}`} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-stone-warm rounded-full animate-spin" style={{ borderTopColor: '#BFA36A' }} />
          </div>
        ) : published.length === 0 ? (
          <p className="text-center text-soft-gray py-12">{isRtl ? 'محصولی یافت نشد' : 'No products found'}</p>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-3 gap-4" style={{ gridAutoRows: '280px' }}>
              {published.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  name={getName(product)}
                  price={getPrice(product)}
                  category={getCategory(product)}
                  gridClass={gridClasses[i % gridClasses.length]}
                  index={i}
                  visible={visible}
                  liked={liked.has(product.id)}
                  onLike={() => toggleLike(product.id)}
                  viewLabel={t.bestsellers.viewProduct}
                  onAddToCart={onAddToCart}
                  onView={() => onProductClick(product)}
                />
              ))}
            </div>
            <div className="md:hidden grid grid-cols-2 gap-3">
              {published.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  name={getName(product)}
                  price={getPrice(product)}
                  category={getCategory(product)}
                  gridClass=""
                  index={i}
                  visible={visible}
                  liked={liked.has(product.id)}
                  onLike={() => toggleLike(product.id)}
                  viewLabel={t.bestsellers.viewProduct}
                  onAddToCart={onAddToCart}
                  onView={() => onProductClick(product)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: Product;
  name: string;
  price: string;
  category: string;
  gridClass: string;
  index: number;
  visible: boolean;
  liked: boolean;
  onLike: () => void;
  viewLabel: string;
  onAddToCart: (item: CartItem) => void;
  onView: () => void;
}

function ProductCard({ product, name, price, category, gridClass, index, visible, liked, onLike, viewLabel, onAddToCart, onView }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`${gridClass} product-card relative overflow-hidden group cursor-pointer`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(48px) scale(0.97)',
        transition: `opacity 0.9s ease ${index * 0.12}s, transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.12}s`,
        minHeight: '280px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onView}
    >
      <div className="absolute inset-0">
        <img src={product.image} alt={name} className="product-img w-full h-full object-cover object-top" loading="lazy" />
      </div>
      <div className="product-overlay absolute inset-0" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(24,24,24,0.78) 0%, rgba(24,24,24,0.1) 45%, rgba(0,0,0,0.15) 100%)' }} />
      <div className="absolute top-4 start-4">
        <span className="text-caption text-white/80 px-3 py-1 tracking-[0.15em]" style={{ background: 'rgba(24,24,24,0.35)', backdropFilter: 'blur(8px)' }}>{category}</span>
      </div>
      <div
        className="absolute top-4 end-4 flex flex-col gap-2"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : `translateX(${index % 2 === 0 ? '16px' : '-16px'})`,
          transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onLike(); }}
          className="w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{ background: 'rgba(247,244,239,0.92)', backdropFilter: 'blur(8px)' }}
          aria-label="علاقه‌مندی"
        >
          <Heart size={14} className="transition-colors duration-300" style={{ color: liked ? '#e4626c' : '#6F6A64', fill: liked ? '#e4626c' : 'none' }} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart({ id: product.id, name, price, image: product.image, quantity: 1 }); }}
          className="w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{ background: 'rgba(247,244,239,0.92)', backdropFilter: 'blur(8px)' }}
          aria-label={`افزودن ${name}`}
        >
          <ShoppingBag size={14} style={{ color: '#6F6A64' }} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onView(); }}
          className="w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{ background: 'rgba(247,244,239,0.92)', backdropFilter: 'blur(8px)' }}
          aria-label={`مشاهده ${name}`}
        >
          <Eye size={14} style={{ color: '#6F6A64' }} />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div
          className="h-px mb-3"
          style={{
            background: 'linear-gradient(to right, var(--accent-gold), transparent)',
            transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
        <p className="text-sm font-semibold mb-1 transition-colors duration-400" style={{ color: hovered ? 'var(--accent-gold)' : 'rgba(247,244,239,0.97)' }}>{name}</p>
        <div className="flex items-center justify-between">
          <span className="font-en text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>{price}</span>
          <span className="text-caption text-white/50 tracking-[0.15em]">{viewLabel}</span>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(191,163,106,0.07) 0%, transparent 60%)', opacity: hovered ? 1 : 0, transition: 'opacity 0.5s ease' }} />
    </div>
  );
}
