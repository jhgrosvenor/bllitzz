import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/blitzz',
  images: {
    unoptimized: true,
  },
}

export default nextConfig