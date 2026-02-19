import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ascii-webcam",
        destination: "/ascii-webcam.html",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
