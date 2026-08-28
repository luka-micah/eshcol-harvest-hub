import type { Metadata } from "next";
import Link from "next/link";
import { serverApiFetch } from "@/lib/server-api";
import { formatDate } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { PLACEHOLDER_POST_IMAGE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Farm Journal",
  description: "Stories, farming insights and fresh updates from Eshcol Harvest Hub.",
  path: "/farm-journal",
});

export default async function FarmJournalPage() {
  const postsRes = await serverApiFetch("/api/v1/posts");
  const posts: any[] = (await postsRes.json()).posts ?? [];

  return (
    <div className="container-px py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Farm Journal</p>
        <h1 className="mt-2 font-heading text-4xl font-bold">Stories From the Farm</h1>
        <p className="mt-4 text-muted-foreground">
          Growing tips, farm life and everything you want to know about our fresh produce.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/farm-journal/${post.slug}`} className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary/40">
              <img src={post.featuredImage ?? PLACEHOLDER_POST_IMAGE} alt={post.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              {post.category && <p className="text-xs font-medium uppercase text-primary">{post.category.name}</p>}
              <h3 className="mt-1 font-heading text-lg font-semibold group-hover:text-primary">{post.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
              {post.publishedAt && (
                <p className="mt-3 text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="card mt-6 text-center text-muted-foreground">
          Our journal is being written. Check back soon for farm stories.
        </div>
      )}
    </div>
  );
}

