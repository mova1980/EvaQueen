import { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../data/translations';
import EvaQueenLogo from './EvaQueenLogo';

interface HeaderProps {
  cartCount: number;
  onCartOpen: () => void;
  onAuthOpen: () => void;
  onSearchOpen: () => void;
}

const LANGS: { code: Language; label: string }[] = [
  { code: 'fa', label: 'فارسی' },
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
  { code: 'ar', label: 'عربي' },
];

export default function Header({ cartCount, onCartOpen, onAuthOpen, onSearchOpen }: HeaderProps) {
  const { t, lang, setLang, dir } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: t.nav.collections, href: '#collections' },
    { label: t.nav.bestsellers, href: '#bestsellers' },
    { label: t.nav.about, href: '#philosophy' },
    { label: t.nav.club, href: '#newsletter' },
    { label: t.nav.contact, href: '#footer' },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass shadow-luxury py-3' : 'py-5 bg-transparent'
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between gap-6">
          {/* Logo */}
          <a
            href="#hero"
            aria-label="EvaQueen — صفحه اصلی"
            className="flex-shrink-0"
            onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}
          >
            <EvaQueenLogo
              size="md"
              variant={scrolled ? 'dark' : 'light'}
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="منوی اصلی">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`gold-underline text-sm tracking-wide font-medium transition-colors duration-300 ${
                  scrolled ? 'text-soft-gray hover:text-soft-black' : 'text-white/75 hover:text-white'
                }`}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`icon-btn gap-1.5 ${scrolled ? '' : 'text-white/75 hover:!text-white'}`}
                aria-label="تغییر زبان"
              >
                <Globe size={18} />
                <span className="text-xs font-medium hidden sm:block uppercase">{lang}</span>
              </button>
              {langOpen && (
                <div
                  className={`absolute top-full mt-2 bg-ivory-100 border border-stone-warm shadow-luxury rounded-sm py-1 min-w-[90px] z-50 ${
                    dir === 'rtl' ? 'right-0' : 'left-0'
                  }`}
                >
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full px-4 py-2 text-xs text-left hover:bg-stone-warm/50 transition-colors duration-200 ${
                        lang === l.code ? 'text-gold font-semibold' : 'text-soft-gray'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onSearchOpen}
              className={`icon-btn ${scrolled ? '' : 'text-white/75 hover:!text-white'}`}
              aria-label={t.search}
            >
              <Search size={19} />
            </button>

            <button
              onClick={onAuthOpen}
              className={`icon-btn ${scrolled ? '' : 'text-white/75 hover:!text-white'}`}
              aria-label={t.auth.login}
            >
              <User size={19} />
            </button>

            <button
              onClick={onCartOpen}
              className={`icon-btn relative ${scrolled ? '' : 'text-white/75 hover:!text-white'}`}
              aria-label={t.cart.title}
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 rtl:-left-2 rtl:right-auto bg-gold text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className={`lg:hidden icon-btn ${scrolled ? '' : 'text-white/75 hover:!text-white'}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'بستن منو' : 'باز کردن منو'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="glass border-t border-white/20 px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="py-3 text-soft-gray hover:text-gold border-b border-stone-warm/30 last:border-0 transition-colors text-sm font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  setTimeout(() => scrollTo(link.href), 300);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {langOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
      )}
    </>
  );
}
