/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { domains: ['res.cloudinary.com'] },
  swcMinify: true,
  experimental: {
    scrollRestoration: true,
  },
}

module.exports = nextConfig
