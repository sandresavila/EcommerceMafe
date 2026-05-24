import type { NextConfig }
  from "next";

const nextConfig: NextConfig = {

  images: {

    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },

      {
        protocol: "http",
        hostname: "**",
      },

      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },

      {
        protocol: "https",
        hostname: "ecommercemafe.onrender.com",
      },

      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
      
    ],

    unoptimized: true,
  },
};

export default nextConfig;