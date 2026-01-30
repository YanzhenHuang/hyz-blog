'use client'

import { useEffect, useState } from 'react';
import { i18n, isLocaleValid, type Locale } from './config';

export function useCurrentLocale(): Locale {
    const [locale, setLocale] = useState<Locale>(i18n.defaultLocale);

    useEffect(() => {
        const pathLocale = window.location.pathname.split('/')[1];
        if (isLocaleValid(pathLocale)) {
            setLocale(pathLocale as Locale);
        } else {
            const savedLocale = localStorage.getItem('NEXT_LOCALE');
            if(savedLocale && isLocaleValid(savedLocale)) {
                setLocale(savedLocale as Locale);
            }
        }
    }, []);

    return locale;
}

export async function changeLocale(newLocale: Locale) {
    localStorage.setItem('NEXT_LOCALE', newLocale);

    await fetch('/api/change-locale', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newLocale }),
    });

    window.location.reload();
}