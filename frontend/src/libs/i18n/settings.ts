import type {InitOptions} from 'i18next';

export const FALLBACK_LOCALE = 'vi';
export const supportedLocales = ['vi'] as const;
export type Locales = (typeof supportedLocales)[number];

export const LANGUAGE_COOKIE = 'preferred_language';

export function getOptions(lang = FALLBACK_LOCALE, ns = 'common'): InitOptions {
  return {
    // debug: true, // Set to true to see console logs
    supportedLngs: supportedLocales,
    fallbackLng: FALLBACK_LOCALE,
    lng: lang,
    ns,
  };
}