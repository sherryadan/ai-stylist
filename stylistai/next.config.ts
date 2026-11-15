import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [
      { source: "/stylist", destination: "/styling-requests", permanent: false },
      { source: "/search", destination: "/sample-catalog", permanent: false },
      { source: "/pricing", destination: "/how-it-works", permanent: false },
      { source: "/about", destination: "/how-it-works", permanent: false },
      { source: "/faq", destination: "/how-it-works", permanent: false },
      { source: "/contact", destination: "/partner-brands", permanent: false },
    ];
  },
};

export default nextConfig;
