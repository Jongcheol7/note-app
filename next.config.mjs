/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["lh3.googleusercontent.com"], // ✅ 외부 이미지 허용 도메인
  },
};

export default nextConfig;
