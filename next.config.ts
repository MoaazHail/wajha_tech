import type { NextConfig } from "next";

/** Hosts serving CMS-uploaded images, e.g. `CMS_IMAGE_HOSTS=cdn.wajha.sa,res.cloudinary.com`. */
const cmsImageHosts = (process.env.CMS_IMAGE_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

/** The API's origin (API_URL minus the /api/v1 prefix); uploaded images are served from its /images. */
const apiOrigin = process.env.API_URL ? new URL(process.env.API_URL).origin : null;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Server Actions default to 1 MB; project images are accepted up to 5 MB.
    serverActions: { bodySizeLimit: "6mb" },
  },
  // Uploaded images are stored by the API. Proxying keeps them same-origin, so next/image treats them as local files.
  async rewrites() {
    return apiOrigin ? [{ source: "/images/:path*", destination: `${apiOrigin}/images/:path*` }] : [];
  },
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
