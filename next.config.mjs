/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify:false,
    compiler:{
        babel:true
    },
    images: {
      domains: ['motortrade.com.ph'],
    },
  };
  
  export default nextConfig;
  
