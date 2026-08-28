import type { MetadataRoute } from "next";
import { products, posts } from "@/data/catalog";

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const staticRoutes = ["", "/about", "/produce", "/shop", "/for-businesses", "/farm-journal", "/contact"];
  const publishedPosts = posts.filter((p) => p.status === "PUBLISHED");

  return Promise.resolve([
    ...staticRoutes.map((r) => ({ url: `${base}${r}`, lastModified: new Date() })),
    ...products.map((p) => ({ url: `${base}/shop/${p.slug}`, lastModified: new Date() })),
    ...publishedPosts.map((p) => ({
      url: `${base}/farm-journal/${p.slug}`,
      lastModified: new Date(p.publishedAt ?? new Date().toISOString()),
    })),
  ]);
}
