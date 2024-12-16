import { getUserLanguage } from '@/libs/language';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = await getUserLanguage(); // Gọi hàm để lấy ngôn ngữ của người dùng
  console.log('Ngôn ngữ được sử dụng:', locale);
  
  return {
    locale,
    messages: (await import(`../locales/${locale}/common.json`)).default
  };
});
