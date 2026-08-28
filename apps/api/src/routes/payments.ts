import { Router } from "express";
import crypto from "node:crypto";
import { getOrderByPaymentRef } from "@/services/orders/order.service";
import { initializeTransaction, verifyTransaction } from "@/lib/payments/paystack";
import { confirmPayment, sendOrderConfirmationEmails, handlePaystackWebhook } from "@/services/payments/payment.service";
import { ok, fail } from "../lib/http";

const router = Router();

router.post("/initialize", async (req, res) => {
  const { reference, email } = req.body ?? {};
  if (!reference || !email) return fail(res, "reference and email are required", 422);

  const payment = await getOrderByPaymentRef(reference);
  if (!payment) return fail(res, "Payment not found", 404);
  if (payment.status === "PAID") return ok(res, { authorizationUrl: null, alreadyPaid: true });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const callbackUrl = `${appUrl}/shop/checkout/callback?reference=${encodeURIComponent(reference)}`;

  try {
    const data = await initializeTransaction({
      email,
      amountNaira: payment.amount.toNumber(),
      reference,
      callbackUrl,
      metadata: { orderId: payment.orderId },
    });
    return ok(res, { authorizationUrl: data.authorization_url });
  } catch (e) {
    return fail(res, e instanceof Error ? e.message : "Could not initialize payment", 502);
  }
});

router.post("/verify", async (req, res) => {
  const { reference } = req.body ?? {};
  if (!reference) return fail(res, "reference is required", 422);

  try {
    const verification = await verifyTransaction(reference);
    if (verification.status !== "success") return fail(res, "Payment not successful", 402);
    const payment = await confirmPayment(reference);
    await sendOrderConfirmationEmails(payment.orderId);
    return ok(res, { status: "PAID", orderId: payment.orderId });
  } catch (e) {
    return fail(res, e instanceof Error ? e.message : "Verification failed", 502);
  }
});

router.post("/webhook", async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return fail(res, "Paystack not configured", 500);

  const raw = (req as unknown as { rawBody?: string }).rawBody ?? JSON.stringify(req.body);
  const signature = req.headers["x-paystack-signature"] as string | undefined;
  if (!signature) return fail(res, "Missing signature", 401);

  const hash = crypto.createHmac("sha512", secret).update(raw).digest("hex");
  if (hash !== signature) return fail(res, "Invalid signature", 401);

  try {
    const event = JSON.parse(raw);
    await handlePaystackWebhook(event);
    return ok(res, { received: true });
  } catch (e) {
    return fail(res, e instanceof Error ? e.message : "Webhook error", 400);
  }
});

export default router;
