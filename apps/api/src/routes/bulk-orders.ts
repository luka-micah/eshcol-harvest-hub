import { Router } from "express";
import { prisma } from "@/lib/db";
import { createBulkOrder, listBulkOrders, updateBulkStatus } from "@/services/bulk-orders/bulk-order.service";
import { requireAdmin } from "../middleware/auth";
import { ok, fail, parseBody, toError } from "../lib/http";
import { bulkOrderSchema } from "@/lib/validation/schemas";
import { z } from "zod";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = await parseBody(req, bulkOrderSchema);
  if (!parsed.ok) return fail(res, parsed.error, parsed.status);
  const data = parsed.data;
  try {
    const request = await createBulkOrder({
      fullName: data.fullName,
      companyName: data.companyName,
      phone: data.phone,
      email: data.email,
      customerType: data.customerType,
      product: data.product,
      quantityRequired: data.quantityRequired,
      unit: data.unit,
      location: data.location,
      preferredDate: data.preferredDate,
      frequency: data.frequency,
      additionalInfo: data.additionalInfo,
    });
    return ok(res, { id: request.id }, 201);
  } catch (e) {
    const { message, status } = toError(e);
    return fail(res, message, status);
  }
});

router.get("/", requireAdmin, async (_req, res) => {
  const requests = await listBulkOrders();
  return ok(res, { requests });
});

const patchSchema = z.object({ status: z.string().min(1) });

router.patch("/:id", requireAdmin, async (req, res) => {
  const parsed = await parseBody(req, patchSchema);
  if (!parsed.ok) return fail(res, parsed.error, parsed.status);
  try {
    const request = await updateBulkStatus(req.params.id, parsed.data.status);
    return ok(res, { request });
  } catch {
    return fail(res, "Bulk request not found", 404);
  }
});

export default router;
