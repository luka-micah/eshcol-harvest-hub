import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function upsertInventory(
  productId: string,
  data: { availableQty?: number; lowStockThreshold?: number },
) {
  return prisma.inventory.upsert({
    where: { productId },
    update: {
      availableQty:
        data.availableQty !== undefined ? new Prisma.Decimal(data.availableQty) : undefined,
      lowStockThreshold: data.lowStockThreshold,
    },
    create: {
      productId,
      availableQty: new Prisma.Decimal(data.availableQty ?? 0),
      lowStockThreshold: data.lowStockThreshold ?? 10,
    },
  });
}

export async function listLowStockProducts() {
  const products = await prisma.product.findMany({
    include: { inventory: true },
  });
  return products.filter((p) => {
    if (!p.inventory) return false;
    return p.inventory.availableQty.toNumber() <= p.inventory.lowStockThreshold;
  });
}
