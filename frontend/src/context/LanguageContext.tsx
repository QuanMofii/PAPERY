'use client';

import React, { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';
import initI18nClient from '@/libs/i18n/client';
import { usePathname } from 'next/navigation';
import {useTranslation } from 'react-i18next';
import { createInstance } from 'i18next';
type TranslationContextType = {

};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);
const useNamespace = () => {
  const pathname = usePathname();
  return useMemo(() => {
    console.log('useNamespace', pathname);
    const segments = pathname.split('/').filter(Boolean);
    return segments.length > 0 ? segments[segments.length - 1] : 'common';
  }, [pathname]);
};

let count = 1;
const i18nInstance = initI18nClient();
console.log('TranslationProvider instance load')
export const TranslationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  console.log('TranslationProvider', count++);
  const namespace = useNamespace();
  
  const { t } = useTranslation(namespace);
  return (
    <TranslationContext.Provider value={{}}>
      {children}
    </TranslationContext.Provider>
  );
};
