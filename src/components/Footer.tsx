import { Instagram, Twitter, Youtube, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import EvaQueenLogo from './EvaQueenLogo';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="footer" className="bg-soft-black text-white/70 pt-16 pb-8 relative overflow-hidden">
      {/* Subtle gold glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(191,163,106,0.3), transparent)' }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(191,163,106,0.15), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Logo large — centered */}
        <div className="flex justify-center mb-12">
          <EvaQueenLogo variant="gold" size="lg" />
        </div>

        {/* Thin gold divider */}
        <div
          className="w-24 mx-auto h-px mb-12"
          style={{ background: 'linear-gradient(to right, transparent, rgba(191,163,106,0.5), transparent)' }}
        />

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* About */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white text-xs font-semibold mb-4 tracking-[0.2em] uppercase">
              {t.footer.about.title}
            </h4>
            <p className="text-sm leading-relaxed text-white/40">{t.footer.about.text}</p>
          </div>

          {/* Shopping Guide */}
          <div>
            <h4 className="text-white text-xs font-semibold mb-4 tracking-[0.2em] uppercase">
              {t.footer.guide.title}
            </h4>
            <ul className="space-y-2.5">
              {t.footer.guide.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-xs text-white/40 hover:text-gold transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-gold transition-all duration-300" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white text-xs font-semibold mb-4 tracking-[0.2em] uppercase">
              {t.footer.social.title}
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { icon: Instagram, label: 'Instagram', handle: '@evaqueen' },
                { icon: Send, label: 'Telegram', handle: 't.me/EvaQueen' },
                { icon: Twitter, label: 'X / Twitter', handle: '@EvaQueen' },
                { icon: Youtube, label: 'YouTube', handle: 'EvaQueen TV' },
              ].map(({ icon: Icon, label, handle }) => (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-3 group"
                  aria-label={label}
                >
                  <div className="w-7 h-7 border border-white/10 rounded-sm flex items-center justify-center group-hover:border-gold group-hover:text-gold transition-all duration-300">
                    <Icon size={13} />
                  </div>
                  <span className="text-xs text-white/35 group-hover:text-white/70 transition-colors duration-300">
                    {handle}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div>
            <h4 className="text-white text-xs font-semibold mb-4 tracking-[0.2em] uppercase">
              {t.footer.payment.title}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'زرین‌پال' },
                { label: 'PayPal' },
                { label: 'Stripe' },
                { label: 'Visa' },
                { label: 'Mastercard' },
                { label: 'IDPay' },
              ].map((p) => (
                <div
                  key={p.label}
                  className="border border-white/8 px-2 py-2 flex items-center justify-center group hover:border-gold/30 hover:bg-gold/5 transition-all duration-300 cursor-default"
                >
                  <span className="font-en text-[10px] text-white/35 group-hover:text-white/60 transition-colors tracking-wide">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25 tracking-wider">{t.footer.copyright}</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((l) => (
              <a
                key={l}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="font-en text-xs text-white/25 hover:text-gold transition-colors duration-300"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
