import type { NextConfig } from 'next';
import nextPWA from 'next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
};

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  ...nextConfig,
});

export default withPWA({
  reactStrictMode: true,
});
