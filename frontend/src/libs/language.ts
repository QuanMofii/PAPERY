"use server";
import { cookies, headers } from 'next/headers';

export const getUserLanguage = async (): Promise<string> => {
  const cookieStore = cookies(); 
  const cookieLang = (await cookieStore).get('i18next')?.value; 
  
  if (cookieLang) {
    console.log('Cookie ngôn ngữ:', cookieLang);
    return cookieLang; 
  }

  const acceptLanguageHeader = (await headers()).get('accept-language');
  const browserLang = acceptLanguageHeader?.split(',')[0]?.split('-')[0]; 
  
  return browserLang || 'en'; 
};


