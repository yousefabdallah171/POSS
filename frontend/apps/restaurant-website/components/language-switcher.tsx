"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@pos-saas/ui";
import { Globe } from "lucide-react";

/**
 * Language switcher component
 * Allows users to switch between English and Arabic
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";

    startTransition(() => {
      // Replace the locale in the pathname
      const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
      router.push(newPathname);

      // Save preference to localStorage
      localStorage.setItem("preferred-language", newLocale);

      // Set dir attribute on html element for RTL support
      if (typeof window !== "undefined") {
        const htmlElement = document.documentElement;
        htmlElement.dir = newLocale === "ar" ? "rtl" : "ltr";
        htmlElement.lang = newLocale;
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      disabled={isPending}
      className="h-10 w-10"
      aria-label={locale === "en" ? "Switch to Arabic" : "Switch to English"}
      title={locale === "en" ? "عربي" : "English"}
    >
      <Globe className="h-4 w-4" />
      <span className="ml-1 text-xs font-semibold uppercase">{locale}</span>
    </Button>
  );
}
