/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true, // TS 마이그레이션 완료 후 제거 예정
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

export default nextConfig;
