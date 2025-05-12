/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.hf.space",
      },
      {
        protocol: "https",
        hostname: "*.gradio.live",
      },
    ],
  },
};

module.exports = nextConfig;
