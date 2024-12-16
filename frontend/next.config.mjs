// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // i18n: {
//   //   locales: ['en', 'vi', 'jp'], 
//   //   defaultLocale: 'en', 

//   // },
//   output: "standalone",
// };
// export default nextConfig;

import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
};
 
export default withNextIntl(nextConfig);