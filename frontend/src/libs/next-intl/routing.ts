import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
import {Locales, DefaultLocale , LocalePrefix} from '@/constants/language';
export const routing = defineRouting({

  locales: Locales ,
  defaultLocale: DefaultLocale,
  localePrefix: LocalePrefix,
});

export type Locale = (typeof routing.locales)[number];
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
