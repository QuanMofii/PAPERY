export const Locales = ['en', 'vi', 'jp'] as const;
// export const Locales = ['vi'] as const;
export type LocaleSType = (typeof Locales )[number];

export const DefaultLocale = 'vi' as const;
export type DefaultLocaleType = typeof DefaultLocale;

// export const LocalePrefix = 'always' as const;
export const LocalePrefix = 'never' as const;
export type LocalePrefixType = typeof LocalePrefix;