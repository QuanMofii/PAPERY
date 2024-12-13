"use client";
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import en from '@/locales/en/common.json';
import vi from '@/locales/vi/common.json';
import jp from '@/locales/jp/common.json';

const resources = {
  en: { translation: en },
  vi: { translation: vi },
  jp: { translation: jp },
};

i18n
  .use(Backend) // Dùng backend để tải file ngôn ngữ từ server
  .use(LanguageDetector) // Dò ngôn ngữ tự động (localStorage, cookies, navigator.language)
  .use(initReactI18next) // Kết nối i18n với React
  .init({
    resources,
    fallbackLng: 'en', // Ngôn ngữ mặc định nếu không tìm thấy ngôn ngữ phù hợp
    supportedLngs: ['en', 'vi'], // Các ngôn ngữ được hỗ trợ
    debug: true, // Hiện log debug
    detection: {
      order: ['localStorage', 'cookie', 'navigator'], // Thứ tự ưu tiên lấy ngôn ngữ
      caches: ['localStorage', 'cookie'], // Nơi cache ngôn ngữ
    },
    backend: {
      loadPath: '/locales/{{lng}}/common.json', // Đường dẫn đến file ngôn ngữ
    },
    interpolation: {
      escapeValue: false, // Không cần escape HTML
    },
  });

export default i18n;

