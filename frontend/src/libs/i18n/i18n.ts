"use server";
import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { detectLanguage } from '@/libs/i18n/language';
import { DefaultLocale, Locales,DefaultNameSpace } from '@/constants/language';

export async function initI18next(language : string,namespace: string) {
  const i18nInstance = createInstance();
  await i18nInstance
  .use(resourcesToBackend((lng: string,ns: string) => {
    return import(`@/locales/${lng}/${ns}.json`);
  }))
  .init({
    fallbackLng: DefaultLocale,
    fallbackNS: DefaultNameSpace,
    supportedLngs: Locales,
    ns: namespace,
    lng: language,
    interpolation: {
      escapeValue: false,
    },
  });


  return i18nInstance;
}

export async function createTranslation(ns: string) {
  
  const language = await detectLanguage(  Locales, DefaultLocale );
  console.log('language', language);
  const i18nextInstance = await initI18next(language ,ns); 
  const Translation = Array.isArray(ns)
    ? ns.reduce((acc, namespace) => {
        acc[namespace] = i18nextInstance.getResourceBundle(language, namespace);
        return acc;
      }, {} as Record<string, any>)
    : i18nextInstance.getResourceBundle(language, ns);
    console.log('Translation', Translation);
  return {
    t:Translation
  };
}

