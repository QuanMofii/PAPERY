'use client';

import React from 'react';
import {locales} from '@/libs/i18n';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  console.log("i18n.language",i18n.language);
  const currentLanguage =  locales[i18n.language as keyof typeof locales];
  console.log("currentLanguage",currentLanguage);

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      Cookies.set('i18next', lang, { expires: 10 }); 
    });
    }


  return (
    <div className="language-switcher">
      <div className=" "></div>
      <button 
        onClick={() => handleChangeLanguage('en')} 
      >
        English
      </button>
      <button 
        onClick={() => handleChangeLanguage('vi')} 
      >
        Tiếng Việt
      </button>
      <button 
        onClick={() => handleChangeLanguage('jp')} 
      >
        日本語
      </button>
    </div>
  );
};

export default LanguageSwitcher;
