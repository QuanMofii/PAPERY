
import i18next from 'i18next';
import {initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { LNG,DefaultLocale } from '@/constants/language';

const runsOnServerSide = typeof window === 'undefined';

// i18next
//   .use(initReactI18next)
//   .use(LanguageDetector)
//   .use(
//     resourcesToBackend(
//       (lang: string, ns: string) => import(`@/locales/${lang}/${ns}.json`),
//     ),
//   )
//   .init({
//     supportedLngs: ['en', 'vi', 'jp'],
//     fallbackLng: DefaultLocale,
//     lng: undefined, 
//     detection: {
//       order: ['cookie'],
//       lookupCookie: LNG,
//       caches: ['cookie'],
//     },
//     preload: runsOnServerSide ? ['common'] : [],
//   });
// export default i18next;

let initialized = false;
export const  initI18nClient = () => {
  if (!initialized) {
    i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (lang: string, ns: string) => import(`@/locales/${lang}/${ns}.json`),
    ),
  )
  .init({
    supportedLngs: ['en', 'vi', 'jp'],
    fallbackLng: DefaultLocale,
    lng: undefined, 
    detection: {
      order: ['cookie'],
      lookupCookie: LNG,
      caches: ['cookie'],
    },
    preload: runsOnServerSide ? ['common'] : [],
  });
}
}
export default initI18nClient;