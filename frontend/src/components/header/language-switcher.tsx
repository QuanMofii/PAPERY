"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Locales } from "@/constants/language";

export function LanguageSwitcher() {
  const router = useRouter();
  const currentLocale = useLocale();

  const handleLanguageChange = (locale: string) => {
    if (locale !== currentLocale) {
      Cookies.set("NEXT_LOCALE", locale, { path: "/", expires: 365, sameSite: "lax" });
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      {/* Trigger */}
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center justify-between">
          {currentLocale}
          <svg
            className="ml-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown Content */}
      <DropdownMenuContent side="bottom" align="end" className="w-32">
        {Locales.map((locale) => (
          <DropdownMenuItem key={locale} onClick={() => handleLanguageChange(locale)}>
            <span className={locale === currentLocale ? "font-bold" : ""}>{locale}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
