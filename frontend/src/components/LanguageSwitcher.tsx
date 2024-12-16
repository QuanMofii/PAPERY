'use client'; // Đây là Client Component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState<string>('en'); // Mặc định là 'en'
  const router = useRouter();

  // 🟢 Đồng bộ ngôn ngữ từ cookie khi component mount
  useEffect(() => {
    const getLanguageFromCookie = () => {
      const cookieLang = document.cookie
        .split('; ')
        .find(row => row.startsWith('i18next='))
        ?.split('=')[1];
      return cookieLang || 'en'; // Mặc định là 'en' nếu không tìm thấy ngôn ngữ trong cookie
    };

    const lang = getLanguageFromCookie();
    setCurrentLang(lang); // Đồng bộ ngôn ngữ với state
  }, []);

  const handleChangeLanguage = (lang: string) => {
    document.cookie = `i18next=${lang}; path=/; max-age=31536000`; // Lưu cookie ngôn ngữ trong 1 năm
    setCurrentLang(lang); // Cập nhật state của ngôn ngữ hiện tại
    router.refresh(); // Làm mới trang để tải ngôn ngữ mới
  };

  return (
    <div className="language-switcher">
      <button 
        onClick={() => handleChangeLanguage('en')} 
        className={`mr-2 ${currentLang === 'en' ? 'font-bold' : ''}`}
      >
        English
      </button>
      <button 
        onClick={() => handleChangeLanguage('vi')} 
        className={`${currentLang === 'vi' ? 'font-bold' : ''}`}
      >
        Tiếng Việt
      </button>
    </div>
  );
};

export default LanguageSwitcher;
