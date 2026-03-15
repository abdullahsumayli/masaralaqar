import { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/supabase";

const BASE = "https://masaralaqar.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/affiliate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/partners`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/products`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/products/saqr`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/knowledge`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/knowledge/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/knowledge/library`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllBlogPosts(true);
    blogPosts = (posts || []).map((post: { slug: string; updated_at?: string; created_at?: string }) => ({
      url: `${BASE}/knowledge/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : post.created_at ? new Date(post.created_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // ignore if blog fetch fails (e.g. no table)
  }

  return [...staticPages, ...blogPosts];
}
