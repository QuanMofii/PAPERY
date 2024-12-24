"use client";

import React, { createContext, useContext, useState } from "react";
import i18next from "@/libs/i18n";
import Cookies from "js-cookie";

type LanguageContextType = {
  language: string;
  t: (key: string, options?: any) => string;
  changeLanguage: (lang: string) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({
  children,
  initialTranslations,
  initialLang,
}: {
  children: React.ReactNode;
  initialTranslations: Record<string, string>;
  initialLang: string;
}) => {
  const [language, setLanguage] = useState(initialLang);
  const [translations, setTranslations] = useState(initialTranslations);

  // Add initial translations and set initial language
  i18next.addResourceBundle(initialLang, "translation", initialTranslations, true, true);

  const t = (key: string, options?: any) =>
    translations[key] || key;
  const changeLanguage = async (lang: string) => {
    if (lang === language) return;
    await i18next.changeLanguage(lang);
    const newTranslations = i18next.getDataByLanguage(lang)?.translation || {}; 
    setTranslations(newTranslations); 
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
