import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, Translations } from '../data/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'fa',
  setLang: () => {},
  t: translations.fa,
  dir: 'rtl',
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('fa');

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    const dir = translations[newLang].dir;
    document.documentElement.setAttribute('lang', newLang);
    document.documentElement.setAttribute('dir', dir);
    document.body.setAttribute('dir', dir);
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', 'fa');
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.setAttribute('dir', 'rtl');
  }, []);

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, t: translations[lang], dir: translations[lang].dir }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
