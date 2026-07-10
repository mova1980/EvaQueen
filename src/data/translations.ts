export type Language = 'fa' | 'en' | 'tr' | 'ar';

export interface Translations {
  dir: 'rtl' | 'ltr';
  nav: {
    collections: string;
    bestsellers: string;
    about: string;
    club: string;
    contact: string;
  };
  hero: {
    line1: string;
    line2: string;
    cta: string;
  };
  collections: {
    title: string;
    subtitle: string;
    viewAll: string;
    items: { name: string; desc: string }[];
  };
  philosophy: {
    label: string;
    text: string;
    signature: string;
  };
  bestsellers: {
    title: string;
    subtitle: string;
    viewProduct: string;
    products: { name: string; price: string; category: string }[];
  };
  testimonials: {
    title: string;
    items: { name: string; location: string; text: string; rating: number }[];
  };
  newsletter: {
    title: string;
    subtitle: string;
    placeholder: string;
    cta: string;
    note: string;
  };
  footer: {
    about: { title: string; text: string };
    guide: { title: string; links: string[] };
    social: { title: string };
    payment: { title: string };
    copyright: string;
  };
  auth: {
    login: string;
    register: string;
    googleLogin: string;
    email: string;
    password: string;
    name: string;
    submit: string;
    toggle: string;
    close: string;
  };
  cart: {
    title: string;
    empty: string;
    total: string;
    checkout: string;
    remove: string;
  };
  search: string;
}

export const translations: Record<Language, Translations> = {
  fa: {
    dir: 'rtl',
    nav: {
      collections: 'مجموعه‌ها',
      bestsellers: 'محصولات محبوب',
      about: 'درباره ما',
      club: 'باشگاه',
      contact: 'تماس با ما',
    },
    hero: {
      line1: 'کمتر دیده شو...',
      line2: 'بیشتر به یاد بمان.',
      cta: 'کشف مجموعه جدید',
    },
    collections: {
      title: 'مجموعه‌های برتر',
      subtitle: 'هر پارچه داستانی دارد. هر طرح، هویتی.',
      viewAll: 'مشاهده همه',
      items: [
        { name: 'Lumière Nocturne', desc: 'تابش در شب — مجموعه مجلسی ۲۰۲۶' },
        { name: 'Velvet Silence', desc: 'سکوت مخملین — اناقت بی‌صدا' },
        { name: 'Golden Dusk', desc: 'غروب طلایی — برای لحظاتی که ماندگار می‌شوند' },
      ],
    },
    philosophy: {
      label: 'فلسفه ما',
      text: 'زن‌ها به خاطر لباس زیبا نمی‌شوند. لباس‌ها اعتمادی را آشکار می‌کنند که در درون آنهاست. EvaQueen هرگز با زن رقابت نمی‌کند؛ او را کامل می‌کند.',
      signature: 'Eva — Creative Director',
    },
    bestsellers: {
      title: 'محبوب‌ترین‌ها',
      subtitle: 'انتخاب هزاران زن باذوق',
      viewProduct: 'مشاهده',
      products: [
        { name: 'پیراهن گیپور رزگلد', price: '۴،۸۰۰،۰۰۰ تومان', category: 'لباس مجلسی' },
        { name: 'کت و دامن سواره', price: '۳،۲۰۰،۰۰۰ تومان', category: 'ست رسمی' },
        { name: 'پیراهن مخملی نایت', price: '۵،۶۰۰،۰۰۰ تومان', category: 'لباس شب' },
        { name: 'ست دوتکه سیلور', price: '۴،۱۰۰،۰۰۰ تومان', category: 'مجلسی' },
        { name: 'پیراهن طلایی کلاسیک', price: '۶،۳۰۰،۰۰۰ تومان', category: 'لباس عروس' },
      ],
    },
    testimonials: {
      title: 'صدای مشتریان ما',
      items: [
        {
          name: 'سارا محمدی',
          location: 'تهران',
          text: 'پیراهنی که برای مراسم خریدم، همه را مجذوب کرد. کیفیت پارچه و دوخت بی‌نظیر است. واقعاً حس می‌کنم که EvaQueen مرا می‌شناسد.',
          rating: 5,
        },
        {
          name: 'نیلوفر رستمی',
          location: 'اصفهان',
          text: 'سادگی و وقار در هم تنیده‌اند. برند کمیاب‌ایست که بین مد و اصالت تعادل برقرار می‌کند. مطمئناً مشتری دائمی شده‌ام.',
          rating: 5,
        },
        {
          name: 'مریم خان‌احمدی',
          location: 'مشهد',
          text: 'خرید اینترنتی از EvaQueen تجربه‌ای لوکس بود. بسته‌بندی، کیفیت و توجه به جزئیات، همه در بالاترین سطح. ممنونم.',
          rating: 5,
        },
      ],
    },
    newsletter: {
      title: 'باشگاه EvaQueen',
      subtitle: 'به باشگاه مشتریان ما بپیوندید و از تخفیف‌ها و مجموعه‌های اختصاصی مطلع شوید.',
      placeholder: 'آدرس ایمیل شما',
      cta: 'عضویت',
      note: 'هرگز اطلاعات شما را به اشتراک نمی‌گذاریم.',
    },
    footer: {
      about: {
        title: 'درباره EvaQueen',
        text: 'بوتیک دیجیتال لباس مجلسی زنانه. طراحی شده برای زنی که می‌داند سکوت، بلندترین زبان اعتماد است.',
      },
      guide: {
        title: 'راهنمای خرید',
        links: ['راهنمای سایز', 'بازگشت کالا', 'روش‌های پرداخت', 'ارسال سریع', 'پشتیبانی'],
      },
      social: { title: 'شبکه‌های اجتماعی' },
      payment: { title: 'درگاه‌های پرداخت' },
      copyright: '© ۲۰۲۶ EvaQueen — تمامی حقوق محفوظ است.',
    },
    auth: {
      login: 'ورود',
      register: 'عضویت',
      googleLogin: 'ورود با گوگل',
      email: 'ایمیل',
      password: 'رمز عبور',
      name: 'نام کامل',
      submit: 'ادامه',
      toggle: 'حساب کاربری ندارید؟ ثبت نام کنید',
      close: 'بستن',
    },
    cart: {
      title: 'سبد خرید',
      empty: 'سبد خرید شما خالی است.',
      total: 'جمع کل',
      checkout: 'تکمیل خرید',
      remove: 'حذف',
    },
    search: 'جستجو',
  },

  en: {
    dir: 'ltr',
    nav: {
      collections: 'Collections',
      bestsellers: 'Best Sellers',
      about: 'About',
      club: 'Club',
      contact: 'Contact',
    },
    hero: {
      line1: 'Be seen less...',
      line2: 'Be remembered more.',
      cta: 'Explore New Collection',
    },
    collections: {
      title: 'Top Collections',
      subtitle: 'Every fabric tells a story. Every design, an identity.',
      viewAll: 'View All',
      items: [
        { name: 'Lumière Nocturne', desc: 'Radiance at night — Evening Collection 2026' },
        { name: 'Velvet Silence', desc: 'Silent elegance — Timeless refinement' },
        { name: 'Golden Dusk', desc: 'Golden sunset — For moments that last forever' },
      ],
    },
    philosophy: {
      label: 'Our Philosophy',
      text: "Women are not beautiful because of a dress. Dresses reveal the confidence already within them. EvaQueen never competes with a woman — it completes her.",
      signature: 'Eva — Creative Director',
    },
    bestsellers: {
      title: 'Best Sellers',
      subtitle: 'The choice of thousands of discerning women',
      viewProduct: 'View',
      products: [
        { name: 'Rosegold Lace Gown', price: '$320', category: 'Evening Dress' },
        { name: 'Equestrian Suit Set', price: '$215', category: 'Formal Set' },
        { name: 'Night Velvet Dress', price: '$375', category: 'Night Dress' },
        { name: 'Silver Two-Piece Set', price: '$275', category: 'Formal' },
        { name: 'Classic Gold Gown', price: '$420', category: 'Bridal' },
      ],
    },
    testimonials: {
      title: 'What Our Clients Say',
      items: [
        {
          name: 'Sara M.',
          location: 'Tehran',
          text: 'The gown I bought for the ceremony captivated everyone. The fabric quality and craftsmanship are unmatched. EvaQueen truly understands me.',
          rating: 5,
        },
        {
          name: 'Niloofar R.',
          location: 'Isfahan',
          text: 'Simplicity and elegance perfectly intertwined. A rare brand that balances fashion and authenticity. I am definitely a loyal customer now.',
          rating: 5,
        },
        {
          name: 'Maryam K.',
          location: 'Mashhad',
          text: 'Shopping at EvaQueen online was a luxury experience. The packaging, quality, and attention to detail — all at the highest level. Thank you.',
          rating: 5,
        },
      ],
    },
    newsletter: {
      title: 'EvaQueen Club',
      subtitle: 'Join our loyalty club and be the first to know about exclusive collections and offers.',
      placeholder: 'Your email address',
      cta: 'Join Now',
      note: 'We never share your information.',
    },
    footer: {
      about: {
        title: 'About EvaQueen',
        text: "A digital boutique for women's formal wear. Designed for the woman who knows that silence is the loudest language of confidence.",
      },
      guide: {
        title: 'Shopping Guide',
        links: ['Size Guide', 'Returns', 'Payment Methods', 'Express Shipping', 'Support'],
      },
      social: { title: 'Social Media' },
      payment: { title: 'Payment Gateways' },
      copyright: '© 2026 EvaQueen — All rights reserved.',
    },
    auth: {
      login: 'Sign In',
      register: 'Register',
      googleLogin: 'Continue with Google',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      submit: 'Continue',
      toggle: "Don't have an account? Sign up",
      close: 'Close',
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty.',
      total: 'Total',
      checkout: 'Checkout',
      remove: 'Remove',
    },
    search: 'Search',
  },

  tr: {
    dir: 'ltr',
    nav: {
      collections: 'Koleksiyonlar',
      bestsellers: 'En Çok Satanlar',
      about: 'Hakkında',
      club: 'Kulüp',
      contact: 'İletişim',
    },
    hero: {
      line1: 'Daha az görün...',
      line2: 'Daha çok hatırlan.',
      cta: 'Yeni Koleksiyonu Keşfet',
    },
    collections: {
      title: 'Öne Çıkan Koleksiyonlar',
      subtitle: 'Her kumaşın bir hikayesi vardır. Her tasarım, bir kimlik.',
      viewAll: 'Tümünü Görüntüle',
      items: [
        { name: 'Lumière Nocturne', desc: 'Gecede Işıltı — Gece Koleksiyonu 2026' },
        { name: 'Velvet Silence', desc: 'Kadife Sessizlik — Zamansız Zarafet' },
        { name: 'Golden Dusk', desc: 'Altın Alacakaranlık — Unutulmaz Anlar İçin' },
      ],
    },
    philosophy: {
      label: 'Felsefemiz',
      text: "Kadınlar bir elbise yüzünden güzel olmaz. Elbiseler, içlerindeki güveni ortaya çıkarır. EvaQueen bir kadınla hiçbir zaman rekabet etmez — onu tamamlar.",
      signature: 'Eva — Yaratıcı Direktör',
    },
    bestsellers: {
      title: 'En Çok Satanlar',
      subtitle: 'Binlerce seçici kadının tercihi',
      viewProduct: 'Görüntüle',
      products: [
        { name: 'Rosegold Dantel Elbise', price: '€295', category: 'Gece Elbisesi' },
        { name: 'Süvari Takım Elbise', price: '€195', category: 'Resmi Set' },
        { name: 'Gece Kadife Elbise', price: '€345', category: 'Gece Elbisesi' },
        { name: 'Gümüş İkili Takım', price: '€250', category: 'Resmi' },
        { name: 'Klasik Altın Elbise', price: '€385', category: 'Gelinlik' },
      ],
    },
    testimonials: {
      title: 'Müşterilerimizin Sesi',
      items: [
        {
          name: 'Sara M.',
          location: 'Tahran',
          text: "Tören için aldığım elbise herkesi büyüledi. Kumaş kalitesi ve dikişi eşsiz. EvaQueen beni gerçekten anlıyor.",
          rating: 5,
        },
        {
          name: 'Niloofar R.',
          location: 'Isfahan',
          text: 'Sadelik ve zarafet iç içe geçmiş. Moda ile özgünlük arasında denge kuran nadir bir marka. Kesinlikle sadık bir müşteri oldum.',
          rating: 5,
        },
        {
          name: 'Maryam K.',
          location: 'Meşhed',
          text: "EvaQueen'den online alışveriş lüks bir deneyimdi. Ambalaj, kalite ve detaylara gösterilen özen — hepsi en üst düzeyde.",
          rating: 5,
        },
      ],
    },
    newsletter: {
      title: 'EvaQueen Kulübü',
      subtitle: "Sadakat kulübümüze katılın ve özel koleksiyonlardan ilk siz haberdar olun.",
      placeholder: 'E-posta adresiniz',
      cta: 'Şimdi Katıl',
      note: 'Bilgilerinizi asla paylaşmıyoruz.',
    },
    footer: {
      about: {
        title: 'EvaQueen Hakkında',
        text: "Kadın resmi giyiminde dijital butik. Sessizliğin güvenin en yüksek sesi olduğunu bilen kadın için tasarlandı.",
      },
      guide: {
        title: 'Alışveriş Rehberi',
        links: ['Beden Rehberi', 'İadeler', 'Ödeme Yöntemleri', 'Hızlı Teslimat', 'Destek'],
      },
      social: { title: 'Sosyal Medya' },
      payment: { title: 'Ödeme Sistemleri' },
      copyright: '© 2026 EvaQueen — Tüm hakları saklıdır.',
    },
    auth: {
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
      googleLogin: "Google ile Devam Et",
      email: 'E-posta',
      password: 'Şifre',
      name: 'Ad Soyad',
      submit: 'Devam Et',
      toggle: 'Hesabınız yok mu? Kayıt olun',
      close: 'Kapat',
    },
    cart: {
      title: 'Alışveriş Sepeti',
      empty: 'Sepetiniz boş.',
      total: 'Toplam',
      checkout: 'Ödemeye Geç',
      remove: 'Kaldır',
    },
    search: 'Ara',
  },

  ar: {
    dir: 'rtl',
    nav: {
      collections: 'المجموعات',
      bestsellers: 'الأكثر مبيعاً',
      about: 'من نحن',
      club: 'النادي',
      contact: 'اتصل بنا',
    },
    hero: {
      line1: 'كوني أقل حضوراً...',
      line2: 'واتركي أثراً أعمق.',
      cta: 'اكتشفي المجموعة الجديدة',
    },
    collections: {
      title: 'أبرز المجموعات',
      subtitle: 'لكل قماش قصة. ولكل تصميم هوية.',
      viewAll: 'عرض الكل',
      items: [
        { name: 'Lumière Nocturne', desc: 'التألق في الليل — مجموعة السهرة 2026' },
        { name: 'Velvet Silence', desc: 'صمت المخمل — الأناقة الصامتة' },
        { name: 'Golden Dusk', desc: 'الغروب الذهبي — للحظات التي تبقى في الذاكرة' },
      ],
    },
    philosophy: {
      label: 'فلسفتنا',
      text: "لا تصبح المرأة جميلة بسبب فستان. الفساتين تكشف الثقة الكامنة بداخلها. إيفاكوين لا تنافس المرأة أبداً — بل تُكملها.",
      signature: 'إيفا — المديرة الإبداعية',
    },
    bestsellers: {
      title: 'الأكثر مبيعاً',
      subtitle: 'اختيار آلاف النساء الذواقات',
      viewProduct: 'عرض',
      products: [
        { name: 'فستان دانتيل ذهبي وردي', price: '$320', category: 'فستان سهرة' },
        { name: 'طقم السواري الرسمي', price: '$215', category: 'طقم رسمي' },
        { name: 'فستان مخمل الليل', price: '$375', category: 'فستان ليلي' },
        { name: 'طقم فضي ثنائي', price: '$275', category: 'رسمي' },
        { name: 'الفستان الذهبي الكلاسيكي', price: '$420', category: 'زفاف' },
      ],
    },
    testimonials: {
      title: 'آراء عميلاتنا',
      items: [
        {
          name: 'سارة م.',
          location: 'طهران',
          text: 'الفستان الذي اشتريته للحفل أسحر الجميع. جودة القماش والخياطة لا مثيل لها. إيفاكوين تفهمني حقاً.',
          rating: 5,
        },
        {
          name: 'نيلوفار ر.',
          location: 'أصفهان',
          text: 'البساطة والأناقة متشابكتان بشكل مثالي. علامة تجارية نادرة توازن بين الموضة والأصالة. أصبحت عميلة مخلصة.',
          rating: 5,
        },
        {
          name: 'مريم خ.',
          location: 'مشهد',
          text: 'التسوق من إيفاكوين عبر الإنترنت كان تجربة فاخرة. التغليف والجودة والاهتمام بالتفاصيل — كلها في أعلى مستوى.',
          rating: 5,
        },
      ],
    },
    newsletter: {
      title: 'نادي EvaQueen',
      subtitle: 'انضمي إلى نادي الولاء لدينا وكوني أول من يعلم بالمجموعات والعروض الحصرية.',
      placeholder: 'عنوان بريدك الإلكتروني',
      cta: 'انضمي الآن',
      note: 'لن نشارك معلوماتك أبداً.',
    },
    footer: {
      about: {
        title: 'عن EvaQueen',
        text: "بوتيك رقمي للأزياء الرسمية النسائية. مصمم للمرأة التي تعلم أن الصمت هو أعلى صوت للثقة.",
      },
      guide: {
        title: 'دليل التسوق',
        links: ['دليل المقاسات', 'سياسة الإرجاع', 'طرق الدفع', 'الشحن السريع', 'الدعم'],
      },
      social: { title: 'وسائل التواصل الاجتماعي' },
      payment: { title: 'بوابات الدفع' },
      copyright: '© 2026 EvaQueen — جميع الحقوق محفوظة.',
    },
    auth: {
      login: 'تسجيل الدخول',
      register: 'التسجيل',
      googleLogin: 'المتابعة مع Google',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      name: 'الاسم الكامل',
      submit: 'متابعة',
      toggle: 'ليس لديك حساب؟ سجلي الآن',
      close: 'إغلاق',
    },
    cart: {
      title: 'سلة التسوق',
      empty: 'سلة التسوق فارغة.',
      total: 'المجموع',
      checkout: 'إتمام الشراء',
      remove: 'حذف',
    },
    search: 'بحث',
  },
};
