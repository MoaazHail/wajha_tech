import type { MetadataRoute } from "next";

import { SITE } from "@/shared/lib/constants/site.constant";

/** Single page, so the sitemap has one entry; the nav links are anchors on it. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
