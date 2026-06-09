/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Leaflet to work without SSR issues
  transpilePackages: ['leaflet', 'react-leaflet'],
};

module.exports = nextConfig;
