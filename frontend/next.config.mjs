import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin('./src/libs/next-intl/request.ts');
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
};
 
export default withNextIntl(nextConfig);



//   /** @type {import('next').NextConfig} */
//   const nextConfig = {
//     output: "standalone",
//   };

// - export default nextConfig;
