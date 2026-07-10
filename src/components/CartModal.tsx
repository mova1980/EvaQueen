import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CartItem } from '../data/products';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number) => void;
}

export default function CartModal({ isOpen, onClose, items, onRemove }: CartModalProps) {
  const { t, dir } = useLanguage();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 modal-backdrop transition-opacity duration-400 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 z-50 h-full w-full max-w-sm bg-ivory-100 shadow-luxury-lg flex flex-col
          transition-transform duration-500 ease-smooth
          ${dir === 'rtl' ? 'left-0' : 'right-0'}
          ${isOpen
            ? 'translate-x-0'
            : dir === 'rtl'
              ? '-translate-x-full'
              : 'translate-x-full'
          }`}
        role="dialog"
        aria-modal="true"
        aria-label={t.cart.title}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-warm">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-soft-gray" />
            <h2 className="font-semibold text-soft-black">{t.cart.title}</h2>
            {items.length > 0 && (
              <span className="bg-gold text-white text-xs px-2 py-0.5 rounded-full font-en">
                {items.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-soft-gray hover:text-gold transition-colors duration-300"
            aria-label={t.auth.close}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-soft-gray">
              <ShoppingBag size={48} className="text-stone-warm" />
              <p className="text-sm">{t.cart.empty}</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 p-4 border border-stone-warm hover:border-gold/30 transition-colors duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover object-top flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-soft-black truncate">{item.name}</p>
                    <p className="font-en text-xs text-gold mt-1">{item.price}</p>
                    <p className="text-xs text-soft-gray mt-0.5">
                      {t.cart.total}: {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-soft-gray/50 hover:text-red-400 transition-colors duration-300 self-start mt-1"
                    aria-label={`${t.cart.remove} ${item.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-stone-warm">
            <div className="flex justify-between items-center mb-5">
              <span className="text-sm text-soft-gray">{t.cart.total}</span>
              <span className="font-en font-bold text-soft-black">
                {items.reduce((_, item) => item.price, '')}
              </span>
            </div>
            <button className="btn-primary w-full text-sm tracking-widest">
              <span>{t.cart.checkout}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
