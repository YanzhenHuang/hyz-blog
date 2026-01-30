"use client"

import { Languages } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { i18n, isLocaleValid, Locale, localeDetails } from "@/i18n/config";
import { Spinner } from "./spinner";
// import { getDictionary } from "@/i18n/server";


const LanguageSwitcher = (params: {
    dict: any
}) => {

    const { dict } = params;

    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const currentLocale = pathname.split('/')[1];
    const validLocales = i18n.locales;
    const handleLocaleChange = (newLocale: Locale) => {
        startTransition(() => {
            const newPath = pathname.replace(/^\/[^\/]+/, `/${newLocale}`);
            router.push(newPath);

            document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=3153600`;
        });
    }

    useEffect(() => {
        if (!isLocaleValid(currentLocale)) {
            handleLocaleChange(i18n.defaultLocale);
        }
    }, [currentLocale]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Languages className="h-4 w-4" />
                    {isPending ? (
                        <p className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Spinner className="size-3" />
                        </p>
                    ) : localeDetails[currentLocale as Locale].name}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>{dict.ui.select_language}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                    onValueChange={(locale) => handleLocaleChange(locale as Locale)}
                    value={currentLocale}>
                    {validLocales.map((locale) => (
                        <DropdownMenuRadioItem
                            key={locale}
                            value={locale}
                            disabled={locale === currentLocale}
                            className="hover:cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                <span>
                                    {localeDetails[locale].flag}
                                </span>
                                <span>
                                    {localeDetails[locale].name}
                                </span>
                            </span>
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default LanguageSwitcher
