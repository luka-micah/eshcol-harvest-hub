import { Router } from "express";
import { prisma } from "@/lib/db";
import { createOrder, getOrderById, updateOrderStatus } from "@/services/orders/order.service";
import { calculateDeliveryFee } from "@/services/delivery/delivery.service";
import { requireAdmin } from "../middleware/auth";
import { ok, fail, parseBody, toError } from "../lib/http";
import { checkoutSchema } from "@/lib/validation/schemas";
import { z } from "zod";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = await parseBody(req, checkoutSchema);
  if (!parsed.ok) return fail(res, parsed.error, parsed.status);
  const body = parsed.data;

  const fee = await calculateDeliveryFee(body.fulfilmentType, body.delivery?.state, body.delivery?.city);
  if (fee < 0) {
    return fail(res, "Delivery is not available to this location. Please contact the farm.", 422);
  }

  try {
    const order = await createOrder({
      customerName: body.customer.fullName,
      customerEmail: body.customer.email,
      customerPhone: body.customer.phone,
      fulfilmentType: body.fulfilmentType,
      items: body.items,
      delivery: body.delivery,
      deliveryFee: fee,
      notes: body.notes,
      userId: req.user?.id ?? null,
    });
    return ok(
      res,
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        reference: order.payment?.paystackRef,
        total: order.total.toNumber(),
      },
      201,
    );
  } catch (e) {
    const { message, status } = toError(e);
    return fail(res, message, status);
  }
});

router.get("/", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Authentication required" });
  const include = { items: true, payment: true, delivery: true } as const;
  if (req.user.role === "ADMIN" || req.user.role === "SUPER_ADMIN") {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include });
    return ok(res, { orders });
  }
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    include,
  });
  return ok(res, { orders });
});

router.get("/:id", requireAdmin, async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order) return fail(res, "Order not found", 404);
  return ok(res, { order });
});

const statusSchema = z.object({ status: z.string().min(1) });

router.patch("/:id", requireAdmin, async (req, res) => {
  const parsed = await parseBody(req, statusSchema);
  if (!parsed.ok) return fail(res, parsed.error, parsed.status);
  try {
    const order = await updateOrderStatus(req.params.id, parsed.data.status);
    return ok(res, { order });
  } catch (e) {
    const { message, status } = toError(e);
    return fail(res, message, status);
  }
});

export default router;
