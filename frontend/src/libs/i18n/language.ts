"use server";
import { cookies, headers } from 'next/headers';
import { LNG } from '@/constants/language';
export async function detectLanguage(supportedLngs: readonly string[], defaultLng = 'en'): Promise<string> {

  let detectedLng = (await cookies()).get(LNG)?.value;
  
  if (!detectedLng) {

    const acceptLanguageHeader = (await  headers()).get('accept-language');

    if (acceptLanguageHeader) {
      const languages = acceptLanguageHeader
        .split(',')
        .map((lang) => lang.split(';')[0])
        .map((lang) => lang.split('-')[0])
        .filter((lang) => supportedLngs.includes(lang));

      if (languages.length > 0) {
        detectedLng = languages[0];
      }
    }
  }

  return  detectedLng || defaultLng; ;
}
