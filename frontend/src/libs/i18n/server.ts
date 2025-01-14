"use server"
// import {createInstance} from 'i18next';
// import resourcesToBackend from 'i18next-resources-to-backend';
// import {initReactI18next} from 'react-i18next/initReactI18next';
// import {
//   FALLBACK_LOCALE,
//   getOptions,
//   Locales,
//   LANGUAGE_COOKIE,
// } from '@/libs/i18n/settings';
// import {cookies} from 'next/headers';
// import { getUserLanguage } from '@/libs/i18n/language';

// async function initI18next(lang: Locales, namespace: string) {
//   const i18nInstance = createInstance();
//   await i18nInstance
//     .use(initReactI18next)
//     .use(
//       resourcesToBackend(
//         (lang: string, ns: string) => import(`@/locales/${lang}/${ns}.json`),
//       ),
//     )
//     .init(getOptions(lang, namespace));

//   return i18nInstance;
// }

// export async function createTranslation(ns: string): Promise<{ t: Record<string, any> }> {
//   const { locale: lang } = await getUserLanguage();
//   const i18nextInstance = await initI18next(lang, ns);
// //   const serverTranslation = i18nextInstance.getFixedT(lang, Array.isArray(ns) ? ns[0] : ns)
//   const Translation = Array.isArray(ns)
//     ? ns.reduce((acc, namespace) => {
//         acc[namespace] = i18nextInstance.getResourceBundle(lang, namespace);
//         return acc;
//       }, {} as Record<string, any>)
//     : i18nextInstance.getResourceBundle(lang, ns);
//     console.log('Translation', Translation);
//   return {
//     t:Translation
//   };
// }



// src/libs/i18n/server.ts

import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { DefaultLocale, Locales} from '@/constants/language';
import { detectLanguage } from '@/libs/i18n/language';

export const initI18nServer = async (language: string, namespaces: string[]) => {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(
      resourcesToBackend((lng: string, ns: string) =>
        import(`@/locales/${lng}/${ns}.json`)
      )
    )
    .init({
      fallbackLng: DefaultLocale,
      supportedLngs: Locales,
      ns: namespaces,
      lng: language,
      interpolation: { escapeValue: false },
    });

  return i18nInstance;
};

  export const getTranslations = async ( namespaces: string[]) => {
    const language = await detectLanguage( Locales,DefaultLocale);
    const i18nInstance = await initI18nServer(language, namespaces);
    return {
      t: i18nInstance.getFixedT(language, Array.isArray(namespaces) ? namespaces[0] : namespaces),
    };
  };