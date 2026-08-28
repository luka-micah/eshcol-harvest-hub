import { prisma } from "@/lib/db";

/**
 * Calculates the delivery fee for a location using configured DeliveryZones.
 * For PICKUP the fee is always zero. If no matching zone is found we return a
 * sentinel of -1 so the UI can prompt the customer to contact the farm
 * (PRD §17: "Outside service area → Contact Farm").
 */
export async function calculateDeliveryFee(
  fulfilmentType: "PICKUP" | "DELIVERY",
  state?: string,
  city?: string,
): Promise<number> {
  if (fulfilmentType === "PICKUP") return 0;

  const zones = await prisma.deliveryZone.findMany({
    where: { active: true },
    orderBy: { position: "asc" },
  });

  const match = zones.find(
    (z) =>
      z.state.toLowerCase() === (state ?? "").toLowerCase() &&
      (z.area ?? "").toLowerCase() === (city ?? "").toLowerCase(),
  );

  if (match) return match.fee.toNumber();
  // No exact zone: fall back to the first active zone as a default, or -1.
  return zones[0] ? zones[0].fee.toNumber() : -1;
}
