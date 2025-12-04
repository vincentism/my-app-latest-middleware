import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // React 严格模式
  reactStrictMode: true,

  // 压缩
  compress: true,

  // 页面扩展名
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cloudcache.tencent-cloud.com',
        pathname: '/qcloud/ui/static/**',
      },
    ],
  },

  // 开发环境指示器
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },

  // 安全响应头
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;


