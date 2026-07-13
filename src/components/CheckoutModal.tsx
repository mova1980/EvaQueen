import { useState } from 'react';
import { X, CreditCard, MapPin, User, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CartItem } from '../data/products';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onSuccess: () => void;
}

type Step = 'info' | 'shipping' | 'payment' | 'success';

export default function CheckoutModal({ isOpen, onClose, items, onSuccess }: Props) {
  const { t, dir } = useLanguage();
  const [step, setStep] = useState<Step>('info');
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    address: '', city: '', postalCode: '',
    cardNumber: '', cardExpiry: '', cardCVV: '', cardName: '',
  });

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => {
    const num = item.price.replace(/[^0-9]/g, '');
    return sum + (parseInt(num) || 0) * item.quantity;
  }, 0);

  const totalStr = dir === 'rtl'
    ? total.toLocaleString('fa-IR') + ' تومان'
    : '$' + (total / 50000).toFixed(0);

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div key={key}>
      <label className="text-xs text-soft-gray tracking-wider block mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder || label}
        className="luxury-input text-sm"
      />
    </div>
  );

  const steps: Step[] = ['info', 'shipping', 'payment'];
  const stepLabels = dir === 'rtl'
    ? ['اطلاعات', 'آدرس', 'پرداخت']
    : ['Info', 'Shipping', 'Payment'];
  const currentStepIdx = steps.indexOf(step);

  const nextStep = () => {
    if (step === 'info') setStep('shipping');
    else if (step === 'shipping') setStep('payment');
    else if (step === 'payment') { setStep('success'); onSuccess(); }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div
          className="bg-ivory-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-luxury-lg"
          style={{ animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

          <button onClick={onClose} className="absolute top-4 end-4 z-10 text-soft-gray hover:text-gold transition-colors" aria-label={t.auth.close}>
            <X size={20} />
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-soft-black">
                {dir === 'rtl' ? 'تکمیل سفارش' : 'Checkout'}
              </h2>

              {step !== 'success' && (
                <div className="flex items-center justify-center gap-0 mt-6">
                  {steps.map((s, i) => (
                    <div key={s} className="flex items-center">
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-en font-semibold transition-all duration-300"
                        style={{
                          background: i <= currentStepIdx ? '#BFA36A' : 'var(--bg-secondary)',
                          color: i <= currentStepIdx ? '#fff' : '#6F6A64',
                          border: i === currentStepIdx ? '2px solid #BFA36A' : '2px solid transparent',
                        }}
                      >
                        {i < currentStepIdx ? <Check size={12} /> : i + 1}
                      </div>
                      <span className="text-xs text-soft-gray mx-2">{stepLabels[i]}</span>
                      {i < steps.length - 1 && (
                        <div className="w-10 h-px mx-1" style={{ background: i < currentStepIdx ? '#BFA36A' : 'var(--border-warm)' }} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order summary */}
            {step !== 'success' && (
              <div className="border border-stone-warm p-4 mb-6 bg-stone-warm/10">
                <p className="text-xs text-soft-gray tracking-wider mb-3">
                  {dir === 'rtl' ? 'خلاصه سفارش' : 'ORDER SUMMARY'}
                </p>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-12 object-cover object-top flex-shrink-0" loading="lazy" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-soft-black truncate">{item.name}</p>
                        <p className="font-en text-xs text-soft-gray">× {item.quantity}</p>
                      </div>
                      <span className="font-en text-xs" style={{ color: '#BFA36A' }}>{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-stone-warm mt-3 pt-3">
                  <span className="text-sm font-semibold text-soft-black">{dir === 'rtl' ? 'جمع کل' : 'Total'}</span>
                  <span className="font-en font-bold" style={{ color: '#BFA36A' }}>{totalStr}</span>
                </div>
              </div>
            )}

            {/* Step content */}
            {step === 'info' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field('firstName', dir === 'rtl' ? 'نام' : 'First Name')}
                {field('lastName', dir === 'rtl' ? 'نام خانوادگی' : 'Last Name')}
                {field('phone', dir === 'rtl' ? 'شماره تلفن' : 'Phone', 'tel')}
                {field('email', dir === 'rtl' ? 'ایمیل' : 'Email', 'email')}
              </div>
            )}

            {step === 'shipping' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gold mb-2">
                  <MapPin size={16} />
                  <span className="text-sm font-medium">{dir === 'rtl' ? 'آدرس تحویل' : 'Delivery Address'}</span>
                </div>
                {field('address', dir === 'rtl' ? 'آدرس کامل' : 'Full Address')}
                <div className="grid grid-cols-2 gap-4">
                  {field('city', dir === 'rtl' ? 'شهر' : 'City')}
                  {field('postalCode', dir === 'rtl' ? 'کد پستی' : 'Postal Code')}
                </div>
                <div className="flex gap-3 mt-2">
                  {[
                    dir === 'rtl' ? 'پست پیشتاز (۳-۵ روز)' : 'Standard (3-5 days)',
                    dir === 'rtl' ? 'پیک موتوری (۱ روز)' : 'Express (1 day)',
                  ].map((opt, i) => (
                    <label key={i} className="flex-1 flex items-center gap-2 border border-stone-warm p-3 cursor-pointer hover:border-gold transition-colors">
                      <input type="radio" name="shipping" defaultChecked={i === 0} className="accent-gold" />
                      <span className="text-xs text-soft-gray">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gold mb-2">
                  <CreditCard size={16} />
                  <span className="text-sm font-medium">{dir === 'rtl' ? 'اطلاعات پرداخت' : 'Payment Details'}</span>
                </div>
                <div className="flex gap-3 mb-4">
                  {['کارت بانکی', 'زرین‌پال', 'PayPal'].map((m, i) => (
                    <label key={i} className="flex-1 flex items-center justify-center gap-1.5 border border-stone-warm p-2.5 cursor-pointer hover:border-gold transition-colors text-xs text-soft-gray">
                      <input type="radio" name="paymethod" defaultChecked={i === 0} className="accent-gold" />
                      {m}
                    </label>
                  ))}
                </div>
                {field('cardName', dir === 'rtl' ? 'نام روی کارت' : 'Name on Card')}
                {field('cardNumber', dir === 'rtl' ? 'شماره کارت' : 'Card Number', 'text', '•••• •••• •••• ••••')}
                <div className="grid grid-cols-2 gap-4">
                  {field('cardExpiry', dir === 'rtl' ? 'تاریخ انقضا' : 'Expiry', 'text', 'MM/YY')}
                  {field('cardCVV', 'CVV', 'text', '•••')}
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(191,163,106,0.08)' }}>
                  <Check size={36} className="text-gold" />
                </div>
                <h3 className="text-xl font-semibold text-soft-black mb-3">
                  {dir === 'rtl' ? 'سفارش ثبت شد!' : 'Order Placed!'}
                </h3>
                <p className="text-soft-gray text-sm mb-6 max-w-xs mx-auto">
                  {dir === 'rtl'
                    ? 'سفارش شما با موفقیت ثبت شد. اطلاعات پیگیری به ایمیل شما ارسال خواهد شد.'
                    : 'Your order has been placed. Tracking details will be sent to your email.'}
                </p>
                <div className="font-en text-xs text-soft-gray border border-stone-warm inline-block px-4 py-2">
                  ORDER #EQ{Date.now().toString().slice(-6)}
                </div>
                <button onClick={onClose} className="btn-primary w-full mt-6 text-sm tracking-widest">
                  <span>{dir === 'rtl' ? 'بازگشت به فروشگاه' : 'Continue Shopping'}</span>
                </button>
              </div>
            )}

            {/* Navigation */}
            {step !== 'success' && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-warm">
                <button
                  onClick={() => {
                    if (step === 'info') onClose();
                    else if (step === 'shipping') setStep('info');
                    else if (step === 'payment') setStep('shipping');
                  }}
                  className="flex items-center gap-2 text-sm text-soft-gray hover:text-gold transition-colors"
                >
                  {dir === 'rtl' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                  {dir === 'rtl' ? 'قبلی' : 'Back'}
                </button>
                <button onClick={nextStep} className="btn-primary text-sm tracking-widest px-8">
                  <span>
                    {step === 'payment'
                      ? (dir === 'rtl' ? 'پرداخت نهایی' : 'Pay Now')
                      : (dir === 'rtl' ? 'مرحله بعد' : 'Next')}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
