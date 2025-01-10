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



