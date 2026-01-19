/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@pos-saas/ui', '@pos-saas/types'],
  images: {
    domains: ['localhost', 'images.unsplash.com'],
  },
  output: 'standalone',
}

module.exports = nextConfig
