"use client"; // Đây là client component

import React from 'react';
import i18n from '@/context/i18n';


const LanguageSwitcher = () => {
  const handleChangeLanguage = (lang: string) => {

    i18n.changeLanguage(lang)
      .catch((error) => {
        console.error('Error changing language:', error);
      });
  };


  return (
    <div className="language-switcher" >
      <button 
        onClick={() => handleChangeLanguage('en')}
        className={`mr-2 ${i18n.language === 'en' ? 'font-bold' : ''}`}
      >
        English
      </button>
      <button 
        onClick={() => handleChangeLanguage('vi')}
        className={`${i18n.language === 'vi' ? 'font-bold' : ''}`}
      >
        Tiếng Việt
      </button>
    </div>
  );
};

export default LanguageSwitcher;

