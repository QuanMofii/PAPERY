import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { UserProvider } from "@/context/UserContext";
import {  TranslationProvider } from "@/context/LanguageContext";
import { getTranslations  } from "@/libs/i18n/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const {t} = await getTranslations(["landing"]);

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className || ""}>
     
      <TranslationProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </TranslationProvider>
      </body>
    </html>
  );
}