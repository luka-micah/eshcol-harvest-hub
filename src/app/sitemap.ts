import type { MetadataRoute } from "next";
export const dynamic = "force-dynamic";
import { serverApiFetch } from "@/lib/server-api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const staticRoutes = ["", "/about", "/produce", "/shop", "/for-businesses", "/farm-journal", "/contact"];
  const productsRes = await serverApiFetch("/api/v1/products");
  const postsRes = await serverApiFetch("/api/v1/posts");
  const products: any[] = (await productsRes.json()).products ?? [];
  const posts: any[] = (await postsRes.json()).posts ?? [];

  return [
    ...staticRoutes.map((r) => ({ url: `${base}${r}`, lastModified: new Date() })),
    ...products.map((p) => ({ url: `${base}/shop/${p.slug}`, lastModified: new Date() })),
    ...posts.map((p) => ({ url: `${base}/farm-journal/${p.slug}`, lastModified: new Date(p.publishedAt ?? p.createdAt) })),
  ];
}

