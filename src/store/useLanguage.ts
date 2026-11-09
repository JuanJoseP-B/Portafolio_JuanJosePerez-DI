import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'es' | 'en';

type LangState = {
  lang: Lang;
  toggle: () => void;
  setLang: (lang: Lang) => void;
};

export const useLanguage = create<LangState>()(
  persist(
    (set, get) => ({
      lang: 'es',
      toggle: () => set({ lang: get().lang === 'es' ? 'en' : 'es' }),
      setLang: (lang) => set({ lang }),
    }),
    { name: 'portfolio-lang' },
  ),
);

