import type { MetadataRoute } from "next";

import { SITE } from "@/shared/lib/constants/site.constant";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: new URL("/sitemap.xml", SITE.url).toString(),
  };
}
