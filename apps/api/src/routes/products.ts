import { Router } from "express";
import { prisma } from "@/lib/db";
import { listPublishedProducts, listAllProducts, getProductById } from "@/services/products/product.service";
import { requireAdmin } from "../middleware/auth";
import { ok, fail, parseBody, toError } from "../lib/http";
import { productCreateSchema } from "@/lib/validation/schemas";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const router = Router();

router.get("/", async (req, res) => {
  const all = req.query.all === "1";
  const isAdmin = req.user && (req.user.role === "ADMIN" || req.user.role === "SUPER_ADMIN");
  const products = all && isAdmin ? await listAllProducts() : await listPublishedProducts();
  return ok(res, { products });
});

router.post("/", requireAdmin, async (req, res) => {
  const parsed = await parseBody(req, productCreateSchema);
  if (!parsed.ok) return fail(res, parsed.error, parsed.status);

  const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
  if (!category) return fail(res, "Category not found", 404);

  const product = await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      categoryId: parsed.data.categoryId,
      description: parsed.data.description,
      shortDescription: parsed.data.shortDescription,
      unit: parsed.data.unit,
      price: parsed.data.price,
      compareAtPrice: parsed.data.compareAtPrice,
      status: parsed.data.status,
      published: parsed.data.published,
      featured: parsed.data.featured,
      seasonal: parsed.data.seasonal,
      lowStockThreshold: parsed.data.lowStockThreshold,
    },
  });

  await prisma.inventory.upsert({
    where: { productId: product.id },
    update: {},
    create: { productId: product.id, availableQty: 0, lowStockThreshold: parsed.data.lowStockThreshold },
  });

  return ok(res, { product }, 201);
});

router.get("/:id", async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) return fail(res, "Product not found", 404);
  return ok(res, { product });
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const parsed = await parseBody(req, productCreateSchema.partial());
  if (!parsed.ok) return fail(res, parsed.error, parsed.status);
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: parsed.data as Prisma.ProductUpdateInput,
    });
    return ok(res, { product });
  } catch {
    return fail(res, "Product not found", 404);
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    return ok(res, { success: true });
  } catch {
    return fail(res, "Product not found", 404);
  }
});

export default router;
