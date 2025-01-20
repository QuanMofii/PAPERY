// "use client";

// import React, { createContext, useContext, useState } from "react";
// import i18next from "@/libs/i18n";

// type LanguageContextType = {
//   language: string;
//   t: (key: string, options?: any) => string;
//   changeLanguage: (lang: string) => Promise<void>;
//   loadNamespace: (namespaces: string[]) => Promise<void>;
// };

// const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// export const LanguageProvider = ({
//   children,
//   initialLang,
//   namespaces,
//   initialTranslations,
// }: {
//   children: React.ReactNode;
//   initialLang: string;
//   namespaces: string[];
//   initialTranslations: Record<string, Record<string, string>>;
// }) => {
//   const [language, setLanguage] = useState(initialLang);
//   const [loadedNamespaces] = useState(namespaces); 

//   Object.entries(initialTranslations).forEach(([namespace, translations]) => {
//     if (!i18next.hasResourceBundle(initialLang, namespace)) {
//       i18next.addResourceBundle(initialLang, namespace, translations, true, true);
//     }
//   });

//   const t = (key: string, options?: any) => {
//     for (const namespace of loadedNamespaces) {
//       const translation = i18next.getResourceBundle(language, namespace)?.[key];
//       if (translation) return translation;
//     }
//     return key;
//   };

//   const changeLanguage = async (lang: string) => {
//     if (lang === language) return;

//     await i18next.changeLanguage(lang);

//     await Promise.all(
//       loadedNamespaces.map(async (namespace) => {
//         if (!i18next.hasResourceBundle(lang, namespace)) {
//           await i18next.loadNamespaces(namespace);
//         }
//       })
//     );

//     setLanguage(lang);
//   };
  
//   const loadNamespace = async (namespaces: string[]) => {
//     // Không tải lại namespace đã có
//     const newNamespaces = namespaces.filter((ns) => !loadedNamespaces.includes(ns));
//     if (newNamespaces.length === 0) return;

//     await Promise.all(
//       newNamespaces.map(async (namespace) => {
//         if (!i18next.hasResourceBundle(language, namespace)) {
//           await i18next.loadNamespaces(namespace);
//         }
//       })
//     );
//   };

//   return (
//     <LanguageContext.Provider value={{ language, t, changeLanguage, loadNamespace }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };

// export const useLanguage = () => {
//   const context = useContext(LanguageContext);
//   if (!context) {
//     throw new Error("useLanguage must be used within a LanguageProvider");
//   }
//   return context;
// };
