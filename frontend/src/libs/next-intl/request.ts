import { getRequestConfig } from "next-intl/server";
import { routing, Locale } from "./routing";
import { loadMessages } from "@/libs/next-intl/language";
import { DefaultLocale } from "@/constants/language";

export default getRequestConfig(async ({ requestLocale }) => {

  let locale = await requestLocale || DefaultLocale;

  if (!routing.locales.includes(locale as Locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  const messages = await loadMessages({
    locale ,
    baseDir: "src/locales",
  });
  return {
    locale,
    messages,
  };
});

