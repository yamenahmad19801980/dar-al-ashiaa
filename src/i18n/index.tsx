import React, { createContext, useContext, useEffect, useState } from 'react';
import { ar } from './ar';
import { en } from './en';
import { demoStore } from '../store/demoStore';

type TranslationKey = keyof typeof ar;

interface I18nContextType {
  lang: 'ar' | 'en';
  isRtl: boolean;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  setLang: (lang: 'ar' | 'en') => void;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<'ar' | 'en'>(demoStore.getState().language);

  useEffect(() => {
    const unsub = demoStore.subscribe(() => {
      const current = demoStore.getState().language;
      if (current !== lang) {
        setLangState(current);
      }
    });
    return unsub;
  }, [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = (newLang: 'ar' | 'en') => {
    demoStore.setLanguage(newLang);
    setLangState(newLang);
  };

  const toggleLang = () => {
    const next = lang === 'ar' ? 'en' : 'ar';
    setLang(next);
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = lang === 'ar' ? ar : en;
    let text = dict[key] || ar[key] || String(key);

    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }

    return text;
  };

  const isRtl = lang === 'ar';

  return (
    <I18nContext.Provider value={{ lang, isRtl, t, setLang, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useT must be used inside I18nProvider');
  }
  return ctx;
}
