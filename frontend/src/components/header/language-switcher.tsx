'use client';
import {Suspense , useEffect , useState, useRef} from 'react';
import Cookies from 'js-cookie'
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Locales } from '@/constants/language';

export function LanguageSwitcher() {
  const router = useRouter();
  const currentLocale = useLocale(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
 
  
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleLanguageChange = (locale: string) => {
    if (locale !== currentLocale) {
      Cookies.set('NEXT_LOCALE', locale, { path: '/', expires: 365, sameSite: 'lax' });
      router.refresh(); 
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative h-full w-full" ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        className="inline-flex justify-between items-center px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm hover:bg-gray-100"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        {currentLocale}
        <svg
          className="ml-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {Locales.map((locale) => (
              <button
                key={locale}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  locale === currentLocale
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => handleLanguageChange(locale)}
              >
                {locale}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const SuspendedLanguageSwitcher = () => (
  <LanguageSwitcher />
);

export default SuspendedLanguageSwitcher;