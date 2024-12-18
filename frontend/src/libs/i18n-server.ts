
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
  


import i18n, { i18n as i18nType } from 'i18next'; // <-- Import i18n và kiểu `i18n`

let i18nServer: i18nType; // Khai báo kiểu rõ ràng cho i18nServer


  i18nServer = i18n.createInstance(); // Tạo instance riêng cho server
  i18nServer.init({
    resources,
    fallbackLng: 'en', // Ngôn ngữ mặc định
    interpolation: {
      escapeValue: false,
    },
  });


export default i18nServer;
