import { serverApiFetch } from "@/lib/server-api";
import { PostManager } from "@/components/admin/PostManager";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const [postsRes, categoriesRes] = await Promise.all([
    serverApiFetch("/api/v1/posts?all=1"),
    serverApiFetch("/api/v1/posts/categories"),
  ]);
  const posts: any[] = (await postsRes.json()).posts ?? [];
  const categories: any[] = (await categoriesRes.json()).categories ?? [];

  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold">Content — Farm Journal</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Create, publish, unpublish and delete journal posts. Add SEO title/description from the API if needed.
      </p>
      <div className="mt-6">
        <PostManager
          posts={posts.map((p) => ({
            id: p.id,
            title: p.title,
            status: p.status,
            publishedAt: p.publishedAt,
          }))}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        />
      </div>
    </div>
  );
}

