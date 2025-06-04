import {defineRouting} from 'next-intl/routing';
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_PREFIX,
  LOCALE_COOKIE,
  LOCALE_DETECTION,
  ALTERNATE_LINKS,
} from '@/constants/language';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: SUPPORTED_LOCALES,

  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,

  localePrefix: LOCALE_PREFIX,
  localeCookie: LOCALE_COOKIE,
  localeDetection: LOCALE_DETECTION,
  alternateLinks: ALTERNATE_LINKS,
});