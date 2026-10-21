import type { NextConfig } from "next";

/** Hosts serving CMS-uploaded images, e.g. `CMS_IMAGE_HOSTS=cdn.wajha.sa,res.cloudinary.com`. */
const cmsImageHosts = (process.env.CMS_IMAGE_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: cmsImageHosts.map((hostname) => ({ protocol: "https" as const, hostname })),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
