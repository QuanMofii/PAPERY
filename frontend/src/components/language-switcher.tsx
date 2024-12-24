'use client';

import React from 'react';
import { locales } from '@/libs/i18n';
import { useLanguage } from "@/context/LanguageContext";

const LanguageSwitcher = () => {
  const { language, t, changeLanguage } = useLanguage();
  const handleChangeLanguage = async (lang: string) => {
    await changeLanguage(lang)
    console.log("Change language to:", lang);
  }


  return (
    <div className="language-switcher">
       <p>Current language: {language}</p>
      <div>
        <button onClick={() => handleChangeLanguage("en")}>English</button>
        <button onClick={() => handleChangeLanguage("vi")}>Vietnamese</button>
        <button onClick={() => handleChangeLanguage("jp")}>Japanese</button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
