import { Router } from "express";
import { prisma } from "@/lib/db";
import { listPublishedPosts, listAllPosts, createPost, updatePost, deletePost } from "@/services/blog/blog.service";
import { requireAdmin } from "../middleware/auth";
import { ok, fail, parseBody, toError } from "../lib/http";
import { postSchema } from "@/lib/validation/schemas";
import { slugify } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

const router = Router();

router.get("/categories", async (_req, res) => {
  const categories = await prisma.blogCategory.findMany({ orderBy: { name: "asc" } });
  return ok(res, { categories });
});

router.get("/", async (req, res) => {
  const all = req.query.all === "1";
  const isAdmin = req.user && (req.user.role === "ADMIN" || req.user.role === "SUPER_ADMIN");
  const posts = all && isAdmin ? await listAllPosts() : await listPublishedPosts();
  return ok(res, { posts });
});

router.post("/", requireAdmin, async (req, res) => {
  const parsed = await parseBody(req, postSchema);
  if (!parsed.ok) return fail(res, parsed.error, parsed.status);
  const data = parsed.data;

  const slug = data.slug ? slugify(data.slug) : slugify(data.title);
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) return fail(res, "A post with this slug already exists", 409);

  try {
    const post = await createPost({
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featuredImage,
      status: data.status,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      category: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
      author: req.user ? { connect: { id: req.user.id } } : undefined,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    });
    return ok(res, { post }, 201);
  } catch (e) {
    const { message, status } = toError(e);
    return fail(res, message, status);
  }
});

router.get("/:id", async (req, res) => {
  const post = await prisma.blogPost.findFirst({
    where: { OR: [{ id: req.params.id }, { slug: req.params.id }] },
    include: { category: true },
  });
  if (!post) return fail(res, "Post not found", 404);
  return ok(res, { post });
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const parsed = await parseBody(req, postSchema.partial());
  if (!parsed.ok) return fail(res, parsed.error, parsed.status);
  const data = parsed.data as Prisma.BlogPostUpdateInput;
  if (data.status === "PUBLISHED" && !(data as Record<string, unknown>).publishedAt) {
    data.publishedAt = new Date();
  }
  try {
    const post = await updatePost(req.params.id, data);
    return ok(res, { post });
  } catch {
    return fail(res, "Post not found", 404);
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await deletePost(req.params.id);
    return ok(res, { success: true });
  } catch {
    return fail(res, "Post not found", 404);
  }
});

export default router;
