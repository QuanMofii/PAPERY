import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import { LocaleSType } from "@/constants/language";
import {notFound} from 'next/navigation';
import {routing} from '@/libs/next-intl/routing';
import Header from "@/components/header/header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata({params}: {params: {locale: LocaleSType}}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'langdingPage'});
 
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}


export async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale?: string };
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as LocaleSType)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className || ""}>
        <NextIntlClientProvider messages={messages}>
          <Header/>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export default RootLayout;