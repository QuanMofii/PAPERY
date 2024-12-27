// "use server";
// import { cookies, headers } from 'next/headers';

// export const getUserLanguage = async (): Promise<string> => {
//   const cookieLang = (await cookies()).get('NEXT_LOCALE')?.value; 
//   console.log( "cookieLang",cookieLang);
//   if (cookieLang) {
//     return cookieLang; 
//   }

//   const acceptLanguageHeader = (await headers()).get('accept-language');
//   console.log( "acceptLanguageHeader",acceptLanguageHeader);
//   const browserLang = acceptLanguageHeader?.split(',')[0]?.split('-')[0]; 
//   return browserLang || 'en'; 
// };

"use server";
import { cookies, headers } from 'next/headers';

export const getUserLanguage = async (): Promise<{ locale: string; pathname: string }> => {
  const cookieLang = (await cookies()).get('NEXT_LOCALE')?.value;

  const pathnameHeader = (await headers()).get('x-page-pathname');

  if (!cookieLang) {
    const acceptLanguageHeader = (await headers()).get('accept-language');
    console.log("acceptLanguageHeader", acceptLanguageHeader);
    const browserLang = acceptLanguageHeader?.split(',')[0]?.split('-')[0];
    return {  locale: browserLang || 'en', pathname: pathnameHeader || '/' };
  }

  return {  locale: cookieLang, pathname: pathnameHeader || '/' };
};
