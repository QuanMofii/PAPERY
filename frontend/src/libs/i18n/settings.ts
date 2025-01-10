
// "use server";
// import type {InitOptions} from 'i18next';
// export const FALLBACK_LOCALE = 'vi';
// export const supportedLocales = ['vi'] as const;
// export type Locales = (typeof supportedLocales)[number];

// export const LANGUAGE_COOKIE = 'preferred_language';

// export function getOptions(lang = FALLBACK_LOCALE, ns = 'common'): InitOptions {
//   return {
//     // debug: true, // Set to true to see console logs
//     supportedLngs: supportedLocales,
//     fallbackLng: FALLBACK_LOCALE,
//     lng: lang,
//     ns,
//   };
// }


// import { cookies, headers } from 'next/headers';

// export const getUserLanguage = async (): Promise<{ locale: string }> => {
//   // Lấy ngôn ngữ từ cookie
//   const cookieLang = (await cookies()).get('NEXT_LOCALE')?.value;

//   // Lấy pathname từ header
//   const pathnameHeader = (await headers()).get('x-page-pathname');

//   // Nếu không có ngôn ngữ trong cookie, fallback vào ngôn ngữ trình duyệt
//   if (!cookieLang) {
//     const acceptLanguageHeader = (await headers()).get('accept-language');
//     const browserLang = acceptLanguageHeader?.split(',')[0]?.split('-')[0];
//     return {
//       locale: browserLang || 'en',
     
//     };
//   }

//   return {
//     locale: cookieLang,
  
//   };
// };