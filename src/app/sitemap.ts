// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";
import { TREATMENTS } from "@/lib/treatments";

function toDate(value: string): Date | undefined {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: toDate(post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/agendar`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/tratamentos`, changeFrequency: "monthly", priority: 0.8 },
    ...TREATMENTS.map((t) => ({ url: `${SITE_URL}/tratamentos/${t.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...posts,
  ];
}