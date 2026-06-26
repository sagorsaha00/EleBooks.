/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },

    ],
  },
  reactCompiler: true,
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
