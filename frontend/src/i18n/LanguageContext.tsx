import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { SupportedLanguage, Translations, TRANSLATIONS } from './translations';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  voiceLang: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: Record<SupportedLanguage, LanguageOption> = {
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    voiceLang: 'te-IN',
    flag: 'ఆంధ్ర / తెలంగాణ',
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    voiceLang: 'ta-IN',
    flag: 'தமிழ்நாடு',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    voiceLang: 'hi-IN',
    flag: 'भारत',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    voiceLang: 'en-IN',
    flag: 'India',
  },
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
  currentOption: LanguageOption;
  voiceLang: string;
  speechLang: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'jansakhi_selected_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (saved && ['te', 'ta', 'hi', 'en'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'te'; // Authentic default for rural Andhra/Telangana focus
  });

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  };

  // Sync document.documentElement.lang whenever language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => {
    const t = TRANSLATIONS[language] || TRANSLATIONS.en;
    const currentOption = LANGUAGE_OPTIONS[language] || LANGUAGE_OPTIONS.en;
    return {
      language,
      setLanguage,
      t,
      currentOption,
      voiceLang: currentOption.voiceLang,
      speechLang: currentOption.voiceLang,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
