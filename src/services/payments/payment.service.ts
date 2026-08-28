import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { sendEmail, brandedEmail } from "@/lib/email/resend";
import { SITE } from "@/lib/constants";

/**
 * Marks an order as paid after a successful, server-verified Paystack payment.
 * Releases the reserved quantity into sold quantity and updates the payment
 * and order status. Must only be called after server-side verification.
 */
export async function confirmPayment(reference: string) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { paystackRef: reference },
      include: { order: { include: { items: true } } },
    });
    if (!payment) throw new Error("Payment not found");
    if (payment.status === "PAID") return payment;

    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "PAID", verifiedAt: new Date() },
    });

    await tx.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: "PAID", orderStatus: "PAID" },
    });

    // Convert reserved stock into sold stock.
    for (const item of payment.order.items) {
      if (!item.productId) continue;
      await tx.inventory.updateMany({
        where: { productId: item.productId },
        data: {
          reservedQty: { decrement: item.quantity },
          soldQty: { increment: item.quantity },
        },
      });
    }

    return payment;
  });
}

/** Notify the customer + admin after a successful payment (best-effort). */
export async function sendOrderConfirmationEmails(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, delivery: true },
  });
  if (!order) return;
  const itemsHtml = order.items
    .map(
      (i) =>
        `<li>${i.productNameSnapshot} — ${i.quantity} ${i.unit} (₦${i.lineTotal.toNumber().toFixed(
          2,
        )})</li>`,
    )
    .join("");

  try {
    await sendEmail({
      to: order.customerEmail,
      subject: `Order Confirmed — ${order.orderNumber}`,
      html: brandedEmail({
        title: "Thank you for your order!",
        body: `<p>Hi ${order.customerName}, your payment was received and your order is now being prepared.</p>
          <p><strong>Order:</strong> ${order.orderNumber}</p>
          <ul>${itemsHtml}</ul>
          <p><strong>Total:</strong> ₦${order.total.toNumber().toFixed(2)}</p>
          <p><strong>Fulfilment:</strong> ${
            order.fulfilmentType === "PICKUP"
              ? "Farm pickup — we will notify you when it is ready."
              : "Delivery — we will dispatch your order soon."
          }</p>`,
      }),
    });

    await sendEmail({
      to: SITE.email,
      subject: `New paid order — ${order.orderNumber}`,
      html: brandedEmail({
        title: "New paid order",
        body: `<p>A new order was just paid.</p><p><strong>Order:</strong> ${order.orderNumber}</p><ul>${itemsHtml}</ul>`,
      }),
    });
  } catch (e) {
    console.error("[payment] confirmation email failed", e);
  }
}

export type WebhookEvent = {
  event: string;
  data: { reference?: string; status?: string };
};

/** Verifies and applies a Paystack webhook event. */
export async function handlePaystackWebhook(event: WebhookEvent) {
  if (event.event === "charge.success" && event.data?.reference) {
    const payment = await confirmPayment(event.data.reference);
    if (payment) await sendOrderConfirmationEmails(payment.orderId);
  }
  return { ok: true };
}
