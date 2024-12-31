"use server";
import { cookies, headers } from 'next/headers';

export const getUserLanguage = async (): Promise<{ locale: string; pathname: string }> => {
  // Lấy ngôn ngữ từ cookie
  const cookieLang = (await cookies()).get('NEXT_LOCALE')?.value;

  // Lấy pathname từ header
  const pathnameHeader = (await headers()).get('x-page-pathname');
  const pathname = pathnameHeader === '/' || !pathnameHeader ? '/landing' : pathnameHeader;

  // Nếu không có ngôn ngữ trong cookie, fallback vào ngôn ngữ trình duyệt
  if (!cookieLang) {
    const acceptLanguageHeader = (await headers()).get('accept-language');
    const browserLang = acceptLanguageHeader?.split(',')[0]?.split('-')[0];
    return {
      locale: browserLang || 'en',
      pathname,
    };
  }

  return {
    locale: cookieLang,
    pathname,
  };
};
