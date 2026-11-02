import {readFileSync} from 'fs';

const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';

// The version the app shows to the user. A release can set it; otherwise it is
// the package version, read at build time so the two never drift apart.
const appVersion =
  process.env.NEXT_PUBLIC_APP_VERSION ||
  JSON.parse(readFileSync('./package.json', 'utf8')).version;

const nextConfig = {
  env: {NEXT_PUBLIC_APP_VERSION: appVersion},

  // for build we are not using turbopack as we are only using it for dev, so for svgs configurations we have added webpack config so that svgs can build according to webpack, svgs configurations always required whether it is turbopack or webpack, Currently turbopack is in beta in production so we will use webpack for production build but when it moved to stable version by nextjs then we will remove webpack code.
  turbopack: {
    // Configure how specific file types (like SVGs) should be processed
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'], // Import SVGs directly as React components
        as: '*.js',
      },
    },

    // File extensions that Turbopack will resolve automatically when importing modules
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  webpack(config: any) {
    // Webpack configuration for production builds (when Turbopack is not used)
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            dimensions: false,
          },
        },
      ],
    });

    return config;
  },

  // The browser talks only to this host, so the auth cookie stays first-party.
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    if (!backendUrl) return [];

    return [
      {source: '/api/v1/:path*', destination: `${backendUrl}/api/v1/:path*`},
      {
        source: '/socket.io/:path*',
        destination: `${backendUrl}/socket.io/:path*`,
      },
    ];
  },
  images: {
    unoptimized: !isProduction,

    // when you are using S3 bucket , cloudinary, firebase or some other cloud platforms for image storage then enable this and add hostname for that cloud platform

    ...(isProduction && {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: process.env.AWS_BUCKET_HOSTNAME,
        },
      ],
    }),
  },
};
module.exports = nextConfig;
