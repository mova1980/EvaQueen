import { useState } from 'react';
import { X, CreditCard, MapPin, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CartItem, parsePrice, formatToman } from '../data/products';
import { supabase, logAdminAction } from '../lib/admin';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onSuccess: () => void;
}

type Step = 'info' | 'shipping' | 'payment' | 'success';

export default function CheckoutModal({ isOpen, onClose, items, onSuccess }: Props) {
  const { t, dir } = useLanguage();
  const isRtl = dir === 'rtl';
  const [step, setStep] = useState<Step>('info');
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    address: '', city: '', postalCode: '',
    cardNumber: '', cardExpiry: '', cardCVV: '', cardName: '',
  });

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
  const totalStr = formatToman(totalAmount);

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
  const stepLabels = isRtl ? ['اطلاعات', 'آدرس', 'پرداخت'] : ['Info', 'Shipping', 'Payment'];
  const currentStepIdx = steps.indexOf(step);

  const nextStep = async () => {
    if (step === 'info') setStep('shipping');
    else if (step === 'shipping') setStep('payment');
    else if (step === 'payment') {
      // Save order to database
      setSubmitting(true);
      const ordNum = 'EQ-' + Date.now().toString().slice(-6);
      const itemsJson = items.map((i) => ({ name: i.name, price: i.price, qty: i.quantity, image: i.image }));
      const { error } = await supabase.from('orders').insert({
        order_number: ordNum,
        customer_name: `${form.firstName} ${form.lastName}`,
        customer_email: form.email,
        customer_phone: form.phone,
        status: 'new',
        total_amount: totalStr,
        items_json: itemsJson,
        notes: `آدرس: ${form.address}, ${form.city}, کد پستی: ${form.postalCode}`,
        priority: 'normal',
      });
      await logAdminAction('create_order', 'order', `سفارش جدید ${ordNum} از ${form.firstName} ${form.lastName}`);

      // Also create/update site_user
      if (form.email) {
        await supabase.from('site_users').upsert({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          is_active: true,
          order_count: 1,
        }, { onConflict: 'email' });
      }

      setSubmitting(false);
      if (!error) {
        setOrderNumber(ordNum);
        setStep('success');
        onSuccess();
      }
    }
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
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-soft-black">
                {isRtl ? 'تکمیل سفارش' : 'Checkout'}
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
                  {isRtl ? 'خلاصه سفارش' : 'ORDER SUMMARY'}
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
                  <span className="text-sm font-semibold text-soft-black">{isRtl ? 'جمع کل' : 'Total'}</span>
                  <span className="font-en font-bold" style={{ color: '#BFA36A' }}>{totalStr}</span>
                </div>
              </div>
            )}

            {/* Step content */}
            {step === 'info' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field('firstName', isRtl ? 'نام' : 'First Name')}
                {field('lastName', isRtl ? 'نام خانوادگی' : 'Last Name')}
                {field('phone', isRtl ? 'شماره تلفن' : 'Phone', 'tel')}
                {field('email', isRtl ? 'ایمیل' : 'Email', 'email')}
              </div>
            )}

            {step === 'shipping' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gold mb-2">
                  <MapPin size={16} />
                  <span className="text-sm font-medium">{isRtl ? 'آدرس تحویل' : 'Delivery Address'}</span>
                </div>
                {field('address', isRtl ? 'آدرس کامل' : 'Full Address')}
                <div className="grid grid-cols-2 gap-4">
                  {field('city', isRtl ? 'شهر' : 'City')}
                  {field('postalCode', isRtl ? 'کد پستی' : 'Postal Code')}
                </div>
                <div className="flex gap-3 mt-2">
                  {[
                    isRtl ? 'پست پیشتاز (۳-۵ روز)' : 'Standard (3-5 days)',
                    isRtl ? 'پیک موتوری (۱ روز)' : 'Express (1 day)',
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
                  <span className="text-sm font-medium">{isRtl ? 'اطلاعات پرداخت' : 'Payment Details'}</span>
                </div>
                <div className="flex gap-3 mb-4">
                  {['کارت بانکی', 'زرین‌پال', 'PayPal'].map((m, i) => (
                    <label key={i} className="flex-1 flex items-center justify-center gap-1.5 border border-stone-warm p-2.5 cursor-pointer hover:border-gold transition-colors text-xs text-soft-gray">
                      <input type="radio" name="paymethod" defaultChecked={i === 0} className="accent-gold" />
                      {m}
                    </label>
                  ))}
                </div>
                {field('cardName', isRtl ? 'نام روی کارت' : 'Name on Card')}
                {field('cardNumber', isRtl ? 'شماره کارت' : 'Card Number', 'text', '•••• •••• •••• ••••')}
                <div className="grid grid-cols-2 gap-4">
                  {field('cardExpiry', isRtl ? 'تاریخ انقضا' : 'Expiry', 'text', 'MM/YY')}
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
                  {isRtl ? 'سفارش ثبت شد!' : 'Order Placed!'}
                </h3>
                <p className="text-soft-gray text-sm mb-6 max-w-xs mx-auto">
                  {isRtl
                    ? 'سفارش شما با موفقیت ثبت شد. اطلاعات پیگیری به ایمیل شما ارسال خواهد شد.'
                    : 'Your order has been placed. Tracking details will be sent to your email.'}
                </p>
                <div className="font-en text-xs text-soft-gray border border-stone-warm inline-block px-4 py-2">
                  ORDER #{orderNumber}
                </div>
                <button onClick={onClose} className="btn-primary w-full mt-6 text-sm tracking-widest">
                  <span>{isRtl ? 'بازگشت به فروشگاه' : 'Continue Shopping'}</span>
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
                  {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                  {isRtl ? 'قبلی' : 'Back'}
                </button>
                <button onClick={nextStep} disabled={submitting} className="btn-primary text-sm tracking-widest px-8 disabled:opacity-50">
                  <span>
                    {submitting
                      ? (isRtl ? 'در حال ثبت...' : 'Processing...')
                      : step === 'payment'
                        ? (isRtl ? 'ثبت سفارش' : 'Place Order')
                        : (isRtl ? 'مرحله بعد' : 'Next')}
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
