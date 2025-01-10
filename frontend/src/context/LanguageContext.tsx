"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {initI18next} from "@/libs/i18n/i18n";
import Cookies from "js-cookie";
import { usePathname } from 'next/navigation';
type LanguageContextType = {
  language: string;
  t: (key: string, options?: any) => string;
  changeLanguage: (lang: string) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang: string;
}) => {
  const [language, setLanguage] = useState(initialLang);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const pathname = usePathname();
  
  useEffect(() => {
    const namespace = pathname.replace("/", "") || "default";
    console.log("Current namespace:", namespace);
    initI18next.loadNamespaces(namespace);
    const newTranslations =  initI18next.getResourceBundle(language, namespace);
    console.log("New translations:", newTranslations);
  if (newTranslations) {
    // Thêm bản dịch mới vào i18next
    initI18next.addResourceBundle(language, namespace, newTranslations, true, true);
  }}, [pathname]);

  

  const t = (key: string, options?: any) =>
    translations[key] || key;
  const changeLanguage = async (lang: string) => {
    if (lang === language) return;
    await  initI18next.changeLanguage(lang);
    const newTranslations =  initI18next.getDataByLanguage(lang)?.translation || {}; 
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
