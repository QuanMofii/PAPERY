export let cachedLanguage: string | undefined;

export const getUserLanguage = (): string => {
  // Trả về ngôn ngữ được cache trước đó nếu có
  if (cachedLanguage) return cachedLanguage;

  const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) return savedLanguage;
        
    const browserLanguage = navigator.language.split('-')[0];
    return browserLanguage || 'en'; 
};

export const setUserLanguage = (newLanguage: string) => {
    cachedLanguage = newLanguage;
    localStorage.setItem('i18nextLng', newLanguage);
    document.cookie = `i18nextLng=${newLanguage}; path=/; max-age=${60 * 60 * 24 * 365}`;
};
