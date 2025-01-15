export const LNG = 'lng';

export const Locales = ['en', 'vi', 'jp'] as const;
export type LocaleSType = (typeof Locales )[number];

export const DefaultLocale = 'vi' as const;
export type DefaultLocaleType = typeof DefaultLocale;

export const DefaultNameSpace = 'common' as const;
export type DefaultNameSpaceType = typeof DefaultNameSpace;

export const LocalePrefix = 'never' as const;
export type LocalePrefixType = typeof LocalePrefix;