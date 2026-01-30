import { cookies } from "next/headers";
import {i18n, isLocaleValid, type Locale} from './config';

export async function getLocale(): Promise<Locale> {
    // try to get locale from cookie first
    const savedLocale = (await cookies()).get('NEXT_LOCALE')?.value;

    if (savedLocale && isLocaleValid(savedLocale))
        return savedLocale as Locale;

    return i18n.defaultLocale;
}

export async function getDictionary(local: Locale) {
    try {
        return (await import(`./dictionaries/${local}.ts`)).default;
    } catch (e) {
        return (await import(`./dictionaries/${i18n.defaultLocale}.ts`)).default;
    }
}