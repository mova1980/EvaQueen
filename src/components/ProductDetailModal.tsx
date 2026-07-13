import { useState } from 'react';
import { X, ShoppingBag, Heart, ChevronLeft, ChevronRight, Star, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CartItem } from '../data/products';

export interface ProductDetail {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
  images?: string[];
  description?: string;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
}

interface Props {
  product: ProductDetail | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
  { name: 'مشکی', hex: '#1a1a1a' },
  { name: 'طلایی', hex: '#BFA36A' },
  { name: 'نقره‌ای', hex: '#C0C0C0' },
  { name: 'عاجی', hex: '#F7F4EF' },
];

export default function ProductDetailModal({ product, onClose, onAddToCart }: Props) {
  const { t, dir } = useLanguage();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  const [activeImg, setActiveImg] = useState(0);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const images = product.images?.length ? product.images : [product.image];

  const handleAddToCart = () => {
    if (!selectedSize) return;
    onAddToCart({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const prevImg = () => setActiveImg((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg((i) => (i + 1) % images.length);

  const desc = product.description || (dir === 'rtl'
    ? 'این محصول با بهترین پارچه‌های انتخابی و دوخت دست‌دوز ایرانی طراحی شده است. ترکیبی از اناقت کلاسیک و جذابیت مدرن برای زنی که می‌داند چطور توجه را به خود جلب کند.'
    : 'Crafted with premium hand-selected fabrics and meticulous tailoring. A fusion of classical elegance and modern allure for the woman who commands attention.');

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(24,24,24,0.72)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        <div
          className="bg-ivory-100 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-luxury-lg flex flex-col md:flex-row"
          style={{ animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gold top bar */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold to-transparent absolute top-0 left-0 right-0 z-10" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 end-4 z-20 w-9 h-9 flex items-center justify-center text-soft-gray hover:text-gold transition-colors bg-ivory-100/80 backdrop-blur-sm"
            aria-label={t.auth.close}
          >
            <X size={20} />
          </button>

          {/* Image gallery */}
          <div className="md:w-1/2 relative flex-shrink-0 bg-stone-warm/20" style={{ minHeight: '360px' }}>
            <div className="relative w-full h-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
              {images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${product.name} — ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500"
                  style={{ opacity: i === activeImg ? 1 : 0 }}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              ))}

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute top-1/2 -translate-y-1/2 start-3 w-9 h-9 bg-ivory-100/80 backdrop-blur-sm flex items-center justify-center text-soft-gray hover:text-gold transition-colors"
                    aria-label="تصویر قبلی"
                  >
                    {dir === 'rtl' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute top-1/2 -translate-y-1/2 end-3 w-9 h-9 bg-ivory-100/80 backdrop-blur-sm flex items-center justify-center text-soft-gray hover:text-gold transition-colors"
                    aria-label="تصویر بعدی"
                  >
                    {dir === 'rtl' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className="transition-all duration-300 rounded-full"
                        style={{ width: i === activeImg ? '20px' : '6px', height: '6px', background: i === activeImg ? '#BFA36A' : 'rgba(247,244,239,0.6)' }}
                        aria-label={`تصویر ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Category badge */}
              <div className="absolute top-4 start-4">
                <span className="text-xs text-white/85 px-3 py-1 tracking-[0.1em]" style={{ background: 'rgba(24,24,24,0.45)', backdropFilter: 'blur(8px)' }}>
                  {product.category}
                </span>
              </div>

              {/* Wishlist */}
              <button
                onClick={() => setLiked(!liked)}
                className="absolute top-4 end-4 w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ background: 'rgba(247,244,239,0.92)', backdropFilter: 'blur(8px)' }}
                aria-label="علاقه‌مندی"
              >
                <Heart
                  size={15}
                  style={{ color: liked ? '#e4626c' : '#6F6A64', fill: liked ? '#e4626c' : 'none' }}
                />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="flex-shrink-0 w-14 h-18 overflow-hidden transition-all duration-300"
                    style={{ outline: i === activeImg ? '2px solid #BFA36A' : '1px solid transparent', outlineOffset: '1px', height: '72px' }}
                    aria-label={`تصویر ${i + 1}`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover object-top" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="md:w-1/2 p-8 md:p-10 flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="h-px w-8" style={{ background: '#BFA36A' }} />
                <span className="text-xs text-gold tracking-[0.2em] uppercase font-en">EvaQueen 2026</span>
              </div>
              <h2 className="text-2xl font-semibold text-soft-black mt-2 leading-tight">{product.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-gold fill-gold" />)}
                <span className="text-xs text-soft-gray">(۴۷ نظر)</span>
              </div>
              <div className="font-en text-2xl font-bold mt-3" style={{ color: '#BFA36A' }}>{product.price}</div>
            </div>

            {/* Description */}
            <p className="text-sm text-soft-gray leading-relaxed border-t border-stone-warm pt-5">{desc}</p>

            {/* Colors */}
            <div>
              <div className="text-xs text-soft-gray tracking-wider mb-3 font-semibold">
                {dir === 'rtl' ? 'رنگ' : 'COLOR'}: <span className="text-soft-black">{selectedColor}</span>
              </div>
              <div className="flex gap-2.5">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                    className="w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center"
                    style={{
                      background: c.hex,
                      border: selectedColor === c.name ? '2px solid #BFA36A' : '2px solid transparent',
                      boxShadow: selectedColor === c.name ? '0 0 0 2px rgba(191,163,106,0.3)' : '0 0 0 1px rgba(111,106,100,0.2)',
                    }}
                    aria-label={c.name}
                    aria-pressed={selectedColor === c.name}
                  >
                    {selectedColor === c.name && c.hex === '#F7F4EF' && (
                      <Check size={10} style={{ color: '#6F6A64' }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-soft-gray tracking-wider font-semibold">
                  {dir === 'rtl' ? 'سایز' : 'SIZE'}
                  {selectedSize && <span className="text-soft-black ms-1">{selectedSize}</span>}
                </span>
                <button className="text-xs text-gold hover:underline transition-colors">
                  {dir === 'rtl' ? 'راهنمای سایز' : 'Size guide'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className="font-en text-xs px-4 py-2.5 border transition-all duration-200 font-medium"
                    style={{
                      borderColor: selectedSize === s ? '#BFA36A' : 'var(--border-warm)',
                      background: selectedSize === s ? 'rgba(191,163,106,0.08)' : 'transparent',
                      color: selectedSize === s ? '#BFA36A' : '#6F6A64',
                    }}
                    aria-pressed={selectedSize === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-xs text-red-400 mt-2">
                  {dir === 'rtl' ? '* لطفاً سایز را انتخاب کنید' : '* Please select a size'}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="flex-1 flex items-center justify-center gap-2.5 py-3.5 text-sm font-medium tracking-widest transition-all duration-300"
                style={{
                  background: added ? 'rgba(191,163,106,0.15)' : selectedSize ? 'var(--soft-black, #181818)' : '#ccc',
                  color: added ? '#BFA36A' : '#F7F4EF',
                  cursor: selectedSize ? 'pointer' : 'not-allowed',
                }}
                aria-label={t.cart.title}
              >
                {added ? (
                  <>
                    <Check size={16} />
                    <span>{dir === 'rtl' ? 'افزوده شد' : 'Added!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>{dir === 'rtl' ? 'افزودن به سبد' : 'Add to Cart'}</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setLiked(!liked)}
                className="w-14 flex items-center justify-center border transition-all duration-300 hover:border-gold"
                style={{ borderColor: liked ? '#e4626c' : 'var(--border-warm)' }}
                aria-label="علاقه‌مندی"
              >
                <Heart
                  size={18}
                  style={{ color: liked ? '#e4626c' : '#6F6A64', fill: liked ? '#e4626c' : 'none' }}
                />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 border-t border-stone-warm pt-5">
              {[
                { icon: '🚚', text: dir === 'rtl' ? 'ارسال رایگان' : 'Free Shipping' },
                { icon: '↩', text: dir === 'rtl' ? 'بازگشت ۷ روزه' : '7-day Return' },
                { icon: '✓', text: dir === 'rtl' ? 'ضمانت اصالت' : 'Authenticity' },
              ].map((b) => (
                <div key={b.text} className="text-center">
                  <div className="text-lg mb-1">{b.icon}</div>
                  <div className="text-xs text-soft-gray leading-tight">{b.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
