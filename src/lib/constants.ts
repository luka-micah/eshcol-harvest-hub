/**
 * Centralised business constants for Eshcol Harvest Hub.
 * Keep brand, location and fulfilment text here so it is consistent everywhere.
 */

export const SITE = {
  name: "Eshcol Harvest Hub",
  tagline: "Fresh From Our Farm. Grown With Care.",
  supporting:
    "Quality bell peppers, grown in Jos and delivered fresh to homes, retailers and businesses.",
  vision:
    "To build a trusted agricultural brand that connects quality farm produce with homes, businesses and markets.",
  mission:
    "To grow quality produce, serve customers reliably and create sustainable value through agriculture.",
  location: "Jos, Plateau State, Nigeria",
  farmAddress: "Eshcol Harvest Hub Farm, Jos, Plateau State, Nigeria",
  phone: "+234 000 000 0000",
  email: "hello@eshcolharvesthub.com",
  currency: "NGN",
} as const;

export const WHATSAPP_MESSAGE =
  "Hello Eshcol Harvest Hub, I would like to enquire about fresh bell peppers.";

export const WHATSAPP_BULK_MESSAGE =
  "Hello Eshcol Harvest Hub, I would like to make a bulk order enquiry for bell peppers.";

export function whatsappUrl(message: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Bell pepper quantity options (kg) offered per PRD §12. */
export const BELL_PEPPER_QUANTITIES = [1, 2, 5, 10, 25, 50] as const;

export type Fulfilment = "PICKUP" | "DELIVERY";

export const FULFILMENT_LABELS: Record<Fulfilment, string> = {
  PICKUP: "Farm Pickup",
  DELIVERY: "Delivery",
};

/** Valid order status transitions (PRD §24). */
export const ORDER_STATUS_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["PAYMENT_PENDING", "CANCELLED"],
  PAYMENT_PENDING: ["PAID", "FAILED", "CANCELLED"],
  PAID: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["READY", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY"],
  READY: ["OUT_FOR_DELIVERY", "READY_FOR_PICKUP"],
  READY_FOR_PICKUP: ["PICKED_UP", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "FAILED"],
  DELIVERED: [],
  PICKED_UP: [],
  CANCELLED: [],
  FAILED: ["PENDING", "PAYMENT_PENDING"],
};

export function canTransition(from: string, to: string): boolean {
  return ORDER_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

/** Local placeholder artwork used when a record has no real image (dev/demo). */
export const PLACEHOLDER_PRODUCT_IMAGE = "/placeholder-product.svg";
export const PLACEHOLDER_POST_IMAGE = "/placeholder-post.svg";
