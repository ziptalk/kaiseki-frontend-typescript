/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ["sapphire-tough-louse-440.mypinata.cloud"] },
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
