"use server";
import { cookies, headers } from 'next/headers';

export async function detectLanguage(supportedLngs: readonly string[], defaultLng = 'en'): Promise<string> {
  const requestHeaders = headers();
  const cookieStore = cookies();


  let detectedLng = (await cookieStore).get('lng')?.value;
  console.log('detectedLng', detectedLng);
  if (!detectedLng) {
    const acceptLanguageHeader = (await requestHeaders).get('accept-language');

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
export async function setLanguage(lang: string) {
  const cookieStore = cookies();
  (await cookieStore).set('lng', lang, {
    path: '/',
    sameSite: 'strict',
  });
}