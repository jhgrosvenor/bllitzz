import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/bllitzz',
  images: {
    unoptimized: true,
  },
  // Add these lines
  experimental: {
    typedRoutes: true,
  },
  distDir: '.next',
}

export default nextConfig