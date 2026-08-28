import { prisma } from "@/lib/db";
import type { Product, ProductStatus } from "@prisma/client";

export type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  unit: string;
  price: number;
  compareAtPrice: number | null;
  status: ProductStatus;
  featured: boolean;
  image: string | null;
  availableQty: number;
};

export async function listPublishedProducts(): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: { published: true },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      inventory: true,
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return products.map(mapListItem);
}

export async function listAllProducts(): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      inventory: true,
    },
    orderBy: [{ createdAt: "desc" }],
  });
  return products.map(mapListItem);
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, published: true },
    include: { images: { orderBy: { position: "asc" } }, inventory: true, category: true },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } }, inventory: true, category: true },
  });
}

function mapListItem(p: {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  unit: string;
  price: { toNumber(): number };
  compareAtPrice: { toNumber(): number } | null;
  status: ProductStatus;
  featured: boolean;
  images: { url: string }[];
  inventory: { availableQty: { toNumber(): number } } | null;
}): ProductListItem {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    unit: p.unit,
    price: p.price.toNumber(),
    compareAtPrice: p.compareAtPrice ? p.compareAtPrice.toNumber() : null,
    status: p.status,
    featured: p.featured,
    image: p.images[0]?.url ?? null,
    availableQty: p.inventory ? p.inventory.availableQty.toNumber() : 0,
  };
}
