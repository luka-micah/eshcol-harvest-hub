import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function listPublishedPosts() {
  return prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true },
  });
}

export async function listAllPosts() {
  return prisma.blogPost.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPost(data: Prisma.BlogPostCreateInput) {
  return prisma.blogPost.create({ data });
}

export async function updatePost(id: string, data: Prisma.BlogPostUpdateInput) {
  return prisma.blogPost.update({ where: { id }, data });
}

export async function deletePost(id: string) {
  return prisma.blogPost.delete({ where: { id } });
}
