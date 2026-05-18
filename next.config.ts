import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "cdn2.steamgriddb.com",
      "play-lh.googleusercontent.com",
      "lh3.googleusercontent.com",
      "media4.giphy.com",
      "m.media-amazon.com",
      "supercell.com",
      "encrypted-tbn0.gstatic.com",
      "www.midasbuy.com",
      "midasbuy.akamaized.net",
      "upload.wikimedia.org"
    ],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn2.steamgriddb.com" },
      { protocol: "https", hostname: "*.giphy.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "play-lh.googleusercontent.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "supercell.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "www.midasbuy.com" },
      { protocol: "https", hostname: "midasbuy.akamaized.net" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;
