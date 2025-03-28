export const SUPPORTED_LOCALES = ['en', 'vi'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export const LOCALE_PREFIX = 'always' as const;

export const LOCALE_COOKIE = {
  name: 'NEXT_LOCALE',
  maxAge: 365 * 24 * 60 * 60,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

export const LOCALE_DETECTION = true;

export const ALTERNATE_LINKS = true;

export const LANGUAGE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
};
