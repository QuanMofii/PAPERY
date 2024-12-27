import {getRequestConfig} from 'next-intl/server';
import {routing ,Locale} from './routing';
import { getUserLanguage } from '@/libs/next-intl/language';
 
const localesImport = {
  'en': () => import('@/locales/en/login.json'),
  'vi': () => import('@/locales/vi/login.json'),
  'jp': () => import('@/locales/jp/login.json'),
};
 

export default getRequestConfig(async () => {
  // This typically corresponds to the `[locale]` segment
  const locale = await getUserLanguage();



  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  return {
    locale,
    messages: (await import(`@/locales/${locale}/login.json`)).default
  };
});