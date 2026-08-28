import { Router } from "express";
import { prisma } from "@/lib/db";
import { upsertInventory } from "@/services/inventory/inventory.service";
import { requireAdmin } from "../middleware/auth";
import { ok, fail, parseBody } from "../lib/http";
import { z } from "zod";

const router = Router();

router.get("/", requireAdmin, async (_req, res) => {
  const products = await prisma.product.findMany({
    include: { inventory: true },
    orderBy: { name: "asc" },
  });
  const items = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price.toNumber(),
    availableQty: p.inventory?.availableQty.toNumber() ?? 0,
    lowStockThreshold: p.inventory?.lowStockThreshold ?? p.lowStockThreshold,
  }));
  return ok(res, { items });
});

const schema = z.object({
  productId: z.string().min(1),
  availableQty: z.number().nonnegative(),
});

router.post("/", requireAdmin, async (req, res) => {
  const parsed = await parseBody(req, schema);
  if (!parsed.ok) return fail(res, parsed.error, parsed.status);
  const inventory = await upsertInventory(parsed.data.productId, { availableQty: parsed.data.availableQty });
  return ok(res, { inventory });
});

export default router;
