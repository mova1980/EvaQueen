import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label={isLogin ? t.auth.login : t.auth.register}
      >
        <div
          className="bg-ivory-100 w-full max-w-md shadow-luxury-lg relative"
          style={{ animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gold accent top */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

          <div className="p-8 md:p-10">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 end-5 text-soft-gray hover:text-gold transition-colors duration-300"
              aria-label={t.auth.close}
            >
              <X size={20} />
            </button>

            {/* Logo */}
            <div className="text-center mb-8">
              <span
                className="logo-shimmer font-nastaliq text-3xl block mb-2"
                style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
              >
                EvaQueen
              </span>
              <p className="text-sm text-soft-gray">
                {isLogin ? t.auth.login : t.auth.register}
              </p>
            </div>

            {/* Google Button */}
            <button
              className="w-full border border-stone-warm hover:border-gold hover:shadow-gold-sm flex items-center justify-center gap-3 py-3 text-sm text-soft-gray transition-all duration-300 mb-6"
              onClick={onClose}
            >
              {/* Google "G" icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z" />
                <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z" />
                <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
              </svg>
              {t.auth.googleLogin}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-stone-warm" />
              <span className="text-xs text-soft-gray/60">OR</span>
              <div className="flex-1 h-px bg-stone-warm" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="text-xs text-soft-gray tracking-wider block mb-2">
                    {t.auth.name}
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="luxury-input text-sm"
                    placeholder={t.auth.name}
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-soft-gray tracking-wider block mb-2">
                  {t.auth.email}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="luxury-input text-sm"
                  placeholder={t.auth.email}
                  required
                />
              </div>

              <div>
                <label className="text-xs text-soft-gray tracking-wider block mb-2">
                  {t.auth.password}
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="luxury-input text-sm pe-10"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute end-0 bottom-3 text-soft-gray/50 hover:text-gold transition-colors"
                    aria-label={showPass ? 'مخفی کردن رمز' : 'نمایش رمز'}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full text-sm tracking-widest mt-2">
                <span>{t.auth.submit}</span>
              </button>
            </form>

            {/* Toggle */}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-center text-xs text-soft-gray hover:text-gold mt-5 transition-colors duration-300"
            >
              {t.auth.toggle}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
