import { useState } from 'react';
import { X, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { productImages, CartItem } from '../data/products';

export interface CollectionDetail {
  index: number;
  name: string;
  desc: string;
  image: string;
}

interface Props {
  collection: CollectionDetail | null;
  onClose: () => void;
  onProductClick: (productId: number) => void;
  onAddToCart: (item: CartItem) => void;
}

const COLLECTION_PRODUCTS: Record<number, number[]> = {
  0: [0, 1, 2],
  1: [2, 3, 4],
  2: [0, 3, 4],
};

export default function CollectionDetailModal({ collection, onClose, onProductClick, onAddToCart }: Props) {
  const { t, dir } = useLanguage();
  const [activeThumb, setActiveThumb] = useState(0);

  if (!collection) return null;

  const productIds = COLLECTION_PRODUCTS[collection.index] ?? [0, 1, 2];
  const products = t.bestsellers.products;

  const galleryImgs = [collection.image, ...productIds.map(i => productImages[i])];

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(24,24,24,0.78)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        role="dialog"
        aria-modal="true"
        aria-label={collection.name}
      >
        <div
          className="bg-ivory-100 w-full max-w-5xl max-h-[92vh] overflow-y-auto relative shadow-luxury-lg"
          style={{ animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 end-4 z-20 w-9 h-9 flex items-center justify-center text-soft-gray hover:text-gold transition-colors bg-ivory-100/90 backdrop-blur-sm"
            aria-label={t.auth.close}
          >
            <X size={20} />
          </button>

          {/* Hero image */}
          <div className="relative overflow-hidden" style={{ height: 'clamp(260px, 40vh, 440px)' }}>
            {galleryImgs.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${collection.name} ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700"
                style={{ opacity: i === activeThumb ? 1 : 0 }}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ))}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(24,24,24,0.7) 0%, transparent 50%)' }} />

            {/* Nav arrows */}
            <button
              onClick={() => setActiveThumb((i) => (i - 1 + galleryImgs.length) % galleryImgs.length)}
              className="absolute top-1/2 -translate-y-1/2 start-4 w-10 h-10 bg-ivory-100/75 backdrop-blur-sm flex items-center justify-center text-soft-gray hover:text-gold transition-colors"
              aria-label="قبلی"
            >
              {dir === 'rtl' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            </button>
            <button
              onClick={() => setActiveThumb((i) => (i + 1) % galleryImgs.length)}
              className="absolute top-1/2 -translate-y-1/2 end-4 w-10 h-10 bg-ivory-100/75 backdrop-blur-sm flex items-center justify-center text-soft-gray hover:text-gold transition-colors"
              aria-label="بعدی"
            >
              {dir === 'rtl' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </button>

            {/* Title overlay */}
            <div className="absolute bottom-6 start-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-8 bg-gold" />
                <span className="font-en text-xs text-gold/80 tracking-[0.25em]">
                  COLLECTION 0{collection.index + 1}
                </span>
              </div>
              <h2 className="font-en text-3xl font-light text-white tracking-[0.05em]">{collection.name}</h2>
              <p className="text-white/65 text-sm mt-1">{collection.desc}</p>
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 end-8 flex gap-1.5">
              {galleryImgs.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{ width: i === activeThumb ? '20px' : '6px', height: '6px', background: i === activeThumb ? '#BFA36A' : 'rgba(247,244,239,0.45)' }}
                  aria-label={`تصویر ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-2 px-6 py-4 border-b border-stone-warm overflow-x-auto">
            {galleryImgs.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveThumb(i)}
                className="flex-shrink-0 w-16 transition-all duration-300 overflow-hidden"
                style={{
                  height: '64px',
                  outline: i === activeThumb ? '2px solid #BFA36A' : '1px solid transparent',
                  outlineOffset: '1px',
                }}
                aria-label={`تصویر ${i + 1}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover object-top" loading="lazy" />
              </button>
            ))}
          </div>

          {/* Products grid */}
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-soft-black">
                {dir === 'rtl' ? 'محصولات این مجموعه' : 'Products in this Collection'}
              </h3>
              <span className="text-xs text-soft-gray">{productIds.length} {dir === 'rtl' ? 'محصول' : 'items'}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {productIds.map((pid, i) => {
                const p = products[pid];
                if (!p) return null;
                return (
                  <div
                    key={i}
                    className="group cursor-pointer"
                    style={{ animation: `fadeIn 0.4s ease ${i * 0.1}s both` }}
                  >
                    <div
                      className="relative overflow-hidden aspect-[3/4] mb-3"
                      onClick={() => onProductClick(pid + 1)}
                    >
                      <img
                        src={productImages[pid]}
                        alt={p.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{ background: 'rgba(24,24,24,0.25)' }}>
                        <span className="text-xs text-white tracking-[0.2em] border border-white/60 px-4 py-2">
                          {dir === 'rtl' ? 'مشاهده' : 'VIEW'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-soft-black leading-tight">{p.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-en text-sm" style={{ color: '#BFA36A' }}>{p.price}</span>
                      <button
                        onClick={() => onAddToCart({ id: pid + 1, name: p.name, price: p.price, image: productImages[pid], quantity: 1 })}
                        className="w-8 h-8 flex items-center justify-center border border-stone-warm hover:border-gold hover:text-gold text-soft-gray transition-all duration-200"
                        aria-label={`افزودن ${p.name} به سبد`}
                      >
                        <ShoppingBag size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
