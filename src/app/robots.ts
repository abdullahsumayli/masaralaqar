import { MetadataRoute } from "next";

const BASE = "https://masaralaqar.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/admin/", "/api/", "/auth/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
