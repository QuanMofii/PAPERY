export const Locales = ['en', 'vi', 'jp'] as const;
export type LocaleSType = (typeof Locales )[number];

export const DefaultLocale = 'en' as const;
export type DefaultLocaleType = typeof DefaultLocale;

export const LocalePrefix = 'never' as const;
export type LocalePrefixType = typeof LocalePrefix;