// // import i18next from 'i18next';
// // import { initReactI18next } from 'react-i18next';
// // import LanguageDetector from 'i18next-browser-languagedetector';
// // import HttpBackend from 'i18next-http-backend';

// // import en from '@/locales/en/translation.json';
// // import vi from '@/locales/vi/translation.json';

// // export const resources = {
// //   en: en,
// //   vi: vi
// // };

// // i18next
// //   .use(HttpBackend) 
// //   .use(LanguageDetector) 
// //   .use(initReactI18next) 
// //   .init({
// //     fallbackLng: 'en', 
// //     debug: true, 
// //     interpolation: {
// //       escapeValue: false, 
// //     },
// //     detection: {
// //       order: ['cookie', 'localStorage', 'navigator'],
// //       caches: ['cookie', 'localStorage'],
// //     },
// //     backend: {
// //       loadPath: '/locales/{{lng}}/{{ns}}.json', 
// //     }
// //   });

// // export default i18next;



// import i18next from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
// import HttpBackend from 'i18next-http-backend';
// // import HttpApi from 'i18next-http-backend';

// // import tranlations from '@/locales/en/translation.json';
// // import vi from '@/locales/vi/translation.json';

// export const resources = {
//   en:{
//     tranlations:{
//       'welcome_message': 'hello'
//     }
//   },
//   vi:{
//     tranlations:{
//       'welcome_message': 'xinchao'
//     }
//   },
// };

// i18next
//   .use(initReactI18next)
//   // .use(HttpBackend)
//   // .use(LanguageDetector)
//   .init({
//     resources,
//     lng:'en',
//     fallbackLng: 'en',
//     // debug: true,
//     // detection: {
//     //   order: ['cookie', 'localStorage', 'navigator'],
//     //   caches: ['cookie', 'localStorage'],
//     // },
//     // backend: {
//     //   // backends: [
//     //   //   // HttpBackend,// primary: Lấy từ localStorage trước
//     //   //   // HttpApi  // fallback: Nếu không có trong localStorage thì lấy từ server qua HTTP
//     //   // ],
//     //   // backendOptions: [{
//     //   //   projectId: 'myLocizeProjectId' 
//     //   // }, {
//     //   //   loadPath: '/locales/{{lng}}/{{ns}}.json' 
//     //   // }],
//     //   // Các tùy chọn khác (giải thích bên dưới)
//     //   loadPath: '/locales/{{lng}}/{{ns}}.json',
//     //   cacheHitMode: 'refreshAndUpdateStore',
//     //   reloadInterval: 60 * 60 * 1000, // Reload tài nguyên sau mỗi 1 giờ
//     //   refreshExpirationTime: 7 * 24 * 60 * 60 * 1000 // Cache trong 7 ngày
//     // },
//     interpolation: {
//       escapeValue: false,
//     },
//   });
// export default i18next;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";


export const locales = {
  en: 'English', 
  vi: 'Tiếng Việt',
  jp: '日本語',
};

export const resources = {
  en: {
    translation: {
      'welcome_message': 'hello'
    }
  },
  vi: {
    translation: {
      'welcome_message': 'xinchao'
    }
  },
};

import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(initReactI18next) 
  .use(LanguageDetector)
  .init({
    resources,
    // lng: lang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
    
  });

  export default i18n;