import {i18n, isLocaleValid, type Locale} from './i18n/config';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    const isMissingLocale = i18n.locales.every(
        (locale) => (
            !pathname.startsWith(`/${locale}/`) && 
            pathname !== `/${locale}`)
    );

    if (!isMissingLocale) {
        return NextResponse.next();
    }

    // Directly use locale from cookie if exists.
    const localeFromCookie = request.cookies.get('NEXT_LOCALE')?.value;

    if (localeFromCookie && isLocaleValid(localeFromCookie)) {
        return NextResponse.redirect(
            new URL(`/${localeFromCookie}${pathname}`, 
                request.url));
    }

    // Decide locale from Accept-Language when cookie doesn't give locale.
    const locale = request.headers.get('Accept-Language')?.split(',')[0]?.split('-')[0] || i18n.defaultLocale;
    const bestLocale = i18n.locales.includes(locale as any) ? locale : i18n.defaultLocale;

    return NextResponse.redirect(
      new URL(`/${bestLocale}${pathname}`, request.url)
    );
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};