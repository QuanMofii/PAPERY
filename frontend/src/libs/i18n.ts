import i18next from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import backend from "i18next-http-backend";


export const locales = {
  en: 'English', 
  vi: 'Tiếng Việt',
  jp: '日本語',
};
i18next
  .use(backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    fallbackNS:'common',
    supportedLngs: ["en", "vi", "jp"],
    backend: {
      loadPath:  'http://localhost:3000/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ["cookie", "localStorage", "navigator"],
      caches: ["cookie"], 
    },
    interpolation: {
      escapeValue: false, 
    },
  })

export default i18next;