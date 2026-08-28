import { Router } from "express";
import { prisma } from "@/lib/db";
import { calculateDeliveryFee } from "@/services/delivery/delivery.service";
import { requireAdmin } from "../middleware/auth";
import { ok, fail, parseBody } from "../lib/http";
import { z } from "zod";

const router = Router();

router.get("/fee", async (req, res) => {
  const fulfilmentType = req.query.fulfilmentType as "PICKUP" | "DELIVERY" | null;
  const state = (req.query.state as string) ?? undefined;
  const city = (req.query.city as string) ?? undefined;
  if (!fulfilmentType) return fail(res, "fulfilmentType is required", 422);
  const fee = await calculateDeliveryFee(fulfilmentType, state, city);
  return ok(res, { fee, deliverable: fee >= 0 });
});

const zoneSchema = z.object({
  name: z.string().min(1),
  area: z.string().optional(),
  state: z.string().default("Plateau"),
  fee: z.number().nonnegative(),
  active: z.boolean().default(true),
});

router.get("/zones", async (_req, res) => {
  const zones = await prisma.deliveryZone.findMany({ orderBy: { position: "asc" } });
  return ok(res, { zones });
});

router.post("/zones", requireAdmin, async (req, res) => {
  const parsed = await parseBody(req, zoneSchema);
  if (!parsed.ok) return fail(res, parsed.error, parsed.status);
  const zone = await prisma.deliveryZone.create({ data: parsed.data });
  return ok(res, { zone }, 201);
});

const patchSchema = z.object({
  fee: z.number().nonnegative().optional(),
  active: z.boolean().optional(),
  name: z.string().optional(),
});

router.patch("/zones/:id", requireAdmin, async (req, res) => {
  const parsed = await parseBody(req, patchSchema);
  if (!parsed.ok) return fail(res, parsed.error, parsed.status);
  try {
    const zone = await prisma.deliveryZone.update({ where: { id: req.params.id }, data: parsed.data });
    return ok(res, { zone });
  } catch {
    return fail(res, "Zone not found", 404);
  }
});

router.delete("/zones/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.deliveryZone.delete({ where: { id: req.params.id } });
    return ok(res, { success: true });
  } catch {
    return fail(res, "Zone not found", 404);
  }
});

export default router;
