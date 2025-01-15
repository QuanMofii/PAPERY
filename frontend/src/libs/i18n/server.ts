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