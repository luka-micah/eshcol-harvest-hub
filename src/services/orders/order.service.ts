import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { ORDER_STATUS_TRANSITIONS } from "@/lib/constants";

export type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfilmentType: "PICKUP" | "DELIVERY";
  items: { productId: string; quantity: number }[];
  delivery?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    directions?: string;
  };
  deliveryFee: number;
  notes?: string;
  userId?: string | null;
};

function generateOrderNumber(): string {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate(),
  ).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `EH-${ymd}-${rand}`;
}

export function generatePaymentReference(): string {
  return `EH-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

/**
 * Creates an order inside a single database transaction:
 *  - validates stock server-side (never trusts client quantities)
 *  - recomputes prices from the database (never trusts client totals)
 *  - reserves inventory
 *  - creates Order, OrderItems, Payment (PENDING) and Delivery
 */
export async function createOrder(input: CreateOrderInput) {
  return prisma.$transaction(async (tx) => {
    let subtotal = new Prisma.Decimal(0);
    const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

    for (const item of input.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        include: { inventory: true },
      });
      if (!product || !product.published) {
        throw new Error(`Product is unavailable: ${item.productId}`);
      }
      const available = product.inventory
        ? product.inventory.availableQty.minus(product.inventory.reservedQty)
        : new Prisma.Decimal(0);
      if (available.lessThan(item.quantity)) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const unitPrice = product.price;
      const lineTotal = unitPrice.mul(item.quantity);
      subtotal = subtotal.plus(lineTotal);

      orderItemsData.push({
        product: { connect: { id: product.id } },
        productNameSnapshot: product.name,
        unitPrice,
        quantity: new Prisma.Decimal(item.quantity),
        unit: product.unit,
        lineTotal,
      });

      // Reserve stock atomically.
      await tx.inventory.update({
        where: { productId: product.id },
        data: {
          availableQty: { decrement: item.quantity },
          reservedQty: { increment: item.quantity },
        },
      });
    }

    const deliveryFee = new Prisma.Decimal(input.deliveryFee || 0);
    const total = subtotal.plus(deliveryFee);

    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: input.userId ?? null,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        subtotal,
        deliveryFee,
        total,
        fulfilmentType: input.fulfilmentType,
        paymentStatus: "PENDING",
        orderStatus: "PAYMENT_PENDING",
        notes: input.notes,
        items: { create: orderItemsData },
        payment: {
          create: {
            paystackRef: generatePaymentReference(),
            amount: total,
          },
        },
        delivery: {
          create: {
            type: input.fulfilmentType,
            status: "PENDING",
            recipientName: input.customerName,
            phone: input.customerPhone,
            line1: input.delivery?.line1,
            line2: input.delivery?.line2,
            city: input.delivery?.city,
            state: input.delivery?.state,
            directions: input.delivery?.directions,
            zoneName: input.delivery ? `${input.delivery.city}, ${input.delivery.state}` : "Farm Pickup",
            fee: deliveryFee,
          },
        },
      },
      include: { payment: true, delivery: true, items: true },
    });

    return order;
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true, payment: true, delivery: true },
  });
}

export async function getOrderByPaymentRef(reference: string) {
  return prisma.payment.findUnique({
    where: { paystackRef: reference },
    include: { order: { include: { items: true, delivery: true } } },
  });
}

export async function updateOrderStatus(orderId: string, toStatus: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");
  if (!canTransition(order.orderStatus, toStatus)) {
    throw new Error(`Invalid status transition: ${order.orderStatus} -> ${toStatus}`);
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { orderStatus: toStatus as Prisma.OrderUpdateInput["orderStatus"] as any },
  });
}

function canTransition(from: string, to: string): boolean {
  return ORDER_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
