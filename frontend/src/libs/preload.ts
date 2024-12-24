import i18next from "@/libs/i18n";

export async function preloadTranslation(lang: string, namespace: string) {
  await i18next.changeLanguage(lang); 
  await i18next.loadNamespaces(namespace); 
  return {
    translations: i18next.getDataByLanguage(lang)?.[namespace] || {},
    lang,
  };
}
