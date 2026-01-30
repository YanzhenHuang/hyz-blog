export const i18n = {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en'],
} as const;

export type Locale = typeof i18n.locales[number];

export const localeDetails = {
    'zh-CN': {
        name: '简体中文',
        flag: '🇨🇳',
    },
    'en': {
        name: 'English',
        flag: '🇺🇸',
    }
}

export function getLocaleFromPath(pathname: string): Locale | null {
    const locale  = pathname.split('/')[1];
    if (i18n.locales.includes(locale as Locale)) {
        return locale as Locale;
    }
    return null;
}

export function isLocaleValid(locale: string): locale is Locale {
    return i18n.locales.includes(locale as Locale);
}