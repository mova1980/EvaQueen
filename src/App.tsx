import { useState } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { CartItem, productImages } from './data/products';
import Header from './components/Header';
import Hero from './components/Hero';
import Collections from './components/Collections';
import Philosophy from './components/Philosophy';
import BestSellers from './components/BestSellers';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import AuthModal from './components/AuthModal';
import SearchOverlay from './components/SearchOverlay';
import ProductDetailModal, { ProductDetail } from './components/ProductDetailModal';
import CollectionDetailModal, { CollectionDetail } from './components/CollectionDetailModal';
import CheckoutModal from './components/CheckoutModal';

function AppInner() {
  const { t } = useLanguage();
  const [cartItems, setCartItems]   = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen]     = useState(false);
  const [authOpen, setAuthOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<CollectionDetail | null>(null);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, item];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id: number, qty: number) => {
    setCartItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  };

  const openProductById = (productId: number) => {
    const idx = productId - 1;
    const p = t.bestsellers.products[idx];
    setSelectedCollection(null);
    setSelectedProduct({
      id: productId,
      name: p?.name ?? '',
      price: p?.price ?? '',
      category: p?.category ?? '',
      image: productImages[idx] ?? productImages[0],
    });
  };

  return (
    <div className="min-h-screen bg-ivory-100">
      <Header
        cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
        onCartOpen={() => setCartOpen(true)}
        onAuthOpen={() => setAuthOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
      />
      <main>
        <Hero />
        <Collections onCollectionClick={(c) => setSelectedCollection(c)} />
        <Philosophy />
        <BestSellers
          onAddToCart={addToCart}
          onProductClick={(p) => setSelectedProduct(p)}
        />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />

      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQty={updateQty}
        onCheckout={() => setCheckoutOpen(true)}
      />
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onProductClick={(p) => { setSearchOpen(false); setSelectedProduct(p); }}
      />
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />
      <CollectionDetailModal
        collection={selectedCollection}
        onClose={() => setSelectedCollection(null)}
        onProductClick={openProductById}
        onAddToCart={addToCart}
      />
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        onSuccess={() => setCartItems([])}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}
