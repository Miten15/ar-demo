/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add proper CORS headers for model files
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://ajax.googleapis.com https://cdn.jsdelivr.net;
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data:;
              font-src 'self';
              connect-src 'self' https://ajax.googleapis.com https://cdn.jsdelivr.net;
              frame-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              block-all-mixed-content;
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      },
      {
        // Apply to model files
        source: '/:path*(glb|usdz|gltf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'model/gltf-binary',
          },
        ],
      },
    ]
  },
  // Optimize images
  images: {
    domains: ['your-domain.com'], // Add your domain where images are hosted
    formats: ['image/webp'],
  },
  // Ensure that model files are treated as static assets
  webpack(config) {
    config.module.rules.push({
      test: /\.(glb|gltf|usdz)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/media',
          outputPath: 'static/media',
          name: '[name].[hash].[ext]',
        },
      },
    });
    
    return config;
  },
  // Enable compression
  compress: true,
};

module.exports = nextConfig;
