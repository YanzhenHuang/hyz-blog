import { Locale } from "@/i18n/config";

export type LocalizedContent<T> = {
    ZH_CN: T;
    EN: T;
};

export function getLocalizedValue<T>(
    content: LocalizedContent<T>,
    locale: Locale,
): T {
    const languageKey = locale.replace('-', '_')
        .toUpperCase() as keyof LocalizedContent<T>;
    return content[languageKey];
}