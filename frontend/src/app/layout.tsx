import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { UserProvider } from "@/context/UserContext";
// import { NextIntlClientProvider } from 'next-intl';
// import { getMessages, getTranslations } from 'next-intl/server';
// import { LocaleSType } from "@/constants/language";
// import { notFound } from 'next/navigation';
// import { routing } from '@/libs/next-intl/routing';
import Header from "@/components/header/header";
import { cookies } from "next/headers";
// import { LocaleProvider } from "@/context/LanguageContext";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// export async function generateMetadata({ params }: { params: Promise<{ locale: LocaleSType }> }): Promise<Metadata> {
//   const { locale } = await params;
//   const t = await getTranslations({ locale });

//   return {
//     title: t('metadata.title'),
//     description: t('metadata.description'),
//   };
// }

export default async function RootLayout({
  children,
  // params,
}: {
  children: React.ReactNode;
  // params: Promise<{ locale: string ,title:string}>;
}) {
  const lang = (await cookies()).get('i18next')?.value || 'en';

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className || ""}>
      {/* <LocaleProvider value={"vi"}> */}
        <LanguageProvider  initialLang={lang}>
          <UserProvider>
            <Header />
            {children}
          </UserProvider>
        {/* </NextIntlClientProvider> */}
        </LanguageProvider>
      </body>
    </html>
  );
}