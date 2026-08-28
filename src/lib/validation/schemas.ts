import { z } from "zod";

const phoneRegex = /^(\+?\d{7,15})$/;

export const customerDetailsSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().regex(phoneRegex, "Please enter a valid phone number"),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().positive("Quantity must be greater than zero"),
});

export const checkoutSchema = z
  .object({
    customer: customerDetailsSchema,
    fulfilmentType: z.enum(["PICKUP", "DELIVERY"]),
    delivery: z
      .object({
        line1: z.string().min(3),
        line2: z.string().optional(),
        city: z.string().min(2),
        state: z.string().min(2),
        directions: z.string().optional(),
      })
      .optional(),
    notes: z.string().max(500).optional(),
    items: z.array(cartItemSchema).min(1, "Your cart is empty"),
  })
  .superRefine((data, ctx) => {
    if (data.fulfilmentType === "DELIVERY" && !data.delivery) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Delivery address is required for delivery orders",
        path: ["delivery"],
      });
    }
  });

export const bulkOrderSchema = z.object({
  fullName: z.string().min(2),
  companyName: z.string().optional(),
  phone: z.string().regex(phoneRegex),
  email: z.string().email(),
  customerType: z.enum([
    "RETAILER",
    "OFFTAKER",
    "RESTAURANT",
    "HOTEL",
    "CATERER",
    "DISTRIBUTOR",
    "OTHER",
  ]),
  product: z.string().optional(),
  quantityRequired: z.string().optional(),
  unit: z.string().optional(),
  location: z.string().optional(),
  preferredDate: z.string().optional(),
  frequency: z
    .enum(["ONE_TIME", "WEEKLY", "BIWEEKLY", "MONTHLY", "OTHER"])
    .default("ONE_TIME"),
  additionalInfo: z.string().max(2000).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(10, "Please enter a longer message"),
});

export const productCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  categoryId: z.string().min(1),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  unit: z.enum(["KILOGRAM", "GRAM", "PIECE", "CRATE", "BAG", "BOX", "CUSTOM"]),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().optional(),
  status: z
    .enum(["IN_STOCK", "LIMITED_STOCK", "COMING_SOON", "SEASONAL", "SOLD_OUT"])
    .default("IN_STOCK"),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
  seasonal: z.boolean().default(false),
  lowStockThreshold: z.number().int().nonnegative().default(10),
});

export const postSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  categoryId: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED"]).default("DRAFT"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});
