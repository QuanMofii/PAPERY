'use client';

import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import i18next from '@/libs/i18n/client';
import { usePathname } from 'next/navigation';
import {useTranslation as useTransAlias} from 'react-i18next';
type TranslationContextType = {
  t: typeof i18next.t;
  language: string;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const pathname = usePathname();
  const language = i18next.language;
  console.log('language', language);

  const namespace = pathname.split('/').filter(Boolean).pop() || 'common';
  const useTranslation = useTransAlias(namespace);
  return (
    <TranslationContext.Provider value={{ t: i18next.t.bind(i18next), language }}>
      {children}
    </TranslationContext.Provider>
  );
};
