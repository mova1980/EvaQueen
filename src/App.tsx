import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartItem } from './data/products';
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

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, item];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-ivory-100">
        <Header
          cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
          onCartOpen={() => setCartOpen(true)}
          onAuthOpen={() => setAuthOpen(true)}
          onSearchOpen={() => setSearchOpen(true)}
        />

        <main>
          <Hero />
          <Collections />
          <Philosophy />
          <BestSellers onAddToCart={addToCart} />
          <Testimonials />
          <Newsletter />
        </main>

        <Footer />

        <CartModal
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          onRemove={removeFromCart}
        />

        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
        />

        <SearchOverlay
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      </div>
    </LanguageProvider>
  );
}
