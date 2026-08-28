import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { PLACEHOLDER_POST_IMAGE } from "@/lib/constants";
import { getPostBySlug } from "@/data/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return buildMetadata({ title: "Article not found" });
  return buildMetadata({
    title: post.title,
    description: post.excerpt ?? "",
    path: `/farm-journal/${post.slug}`,
    image: post.featuredImage ?? undefined,
  });
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="container-px py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/farm-journal" className="text-sm text-primary hover:underline">
          ← Back to Farm Journal
        </Link>
        <h1 className="mt-4 font-heading text-4xl font-bold">{post.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {post.category?.name ? `${post.category.name} · ` : ""}
          {post.publishedAt ? formatDate(post.publishedAt) : ""}
        </p>
        <img
          src={post.featuredImage ?? PLACEHOLDER_POST_IMAGE}
          alt={post.title}
          className="mt-6 aspect-[16/9] w-full rounded-xl object-cover"
        />
        <div
          className="prose-brand mt-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
