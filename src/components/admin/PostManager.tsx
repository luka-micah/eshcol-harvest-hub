"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/index";
import { Badge } from "@/components/ui/index";
import { formatDate } from "@/lib/utils";
import { clientApiFetch } from "@/lib/api-client";

export function PostManager({
  posts,
  categories,
}: {
  posts: any[];
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [status, setStatus] = React.useState("DRAFT");
  const [categoryId, setCategoryId] = React.useState(categories[0]?.id ?? "");
  const [error, setError] = React.useState("");

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await clientApiFetch("/api/v1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          status,
          categoryId: categoryId || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Create failed");
      }
      setTitle("");
      setContent("");
      setExcerpt("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    }
  }

  async function patch(id: string, status: string) {
    await clientApiFetch(`/api/v1/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    await clientApiFetch(`/api/v1/posts/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={create} className="card space-y-4">
        <h2 className="font-heading text-lg font-semibold">New Journal Post</h2>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="content">Content (HTML allowed)</Label>
          <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[160px]" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <select id="category" className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select id="status" className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              {["DRAFT", "PUBLISHED", "UNPUBLISHED"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full">Publish Post</Button>
      </form>

      <div className="space-y-3">
        <h2 className="font-heading text-lg font-semibold">Existing Posts</h2>
        {posts.map((p) => (
          <div key={p.id} className="card flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-xs text-muted-foreground">
                {p.status} · {p.publishedAt ? formatDate(p.publishedAt) : "not published"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {p.status !== "PUBLISHED" ? (
                <Button size="sm" variant="outline" onClick={() => patch(p.id, "PUBLISHED")}>Publish</Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => patch(p.id, "UNPUBLISHED")}>Unpublish</Button>
              )}
              <Button size="sm" variant="outline" onClick={() => remove(p.id)}>Delete</Button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}
      </div>
    </div>
  );
}
