/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"], // ✅ 외부 이미지 허용 도메인
  },
};

export default nextConfig;
