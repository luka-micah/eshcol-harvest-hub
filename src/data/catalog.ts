/**
 * Static demo data for the Eshcol Harvest Hub storefront.
 *
 * The site is currently a fully client-rendered frontend with no backend or
 * database. All product/journal/delivery content lives here. When a real API is
 * added later, swap these helpers for fetches.
 */

export type ProductStatus =
  | "IN_STOCK"
  | "LIMITED_STOCK"
  | "COMING_SOON"
  | "SEASONAL"
  | "SOLD_OUT";

export type ProductUnit = "KILOGRAM" | "PIECE" | "CRATE" | "BAG";

export interface ProductImage {
  url: string;
  alt?: string | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  unit: ProductUnit;
  price: number;
  compareAtPrice: number | null;
  status: ProductStatus;
  featured: boolean;
  image: string | null;
  images: ProductImage[];
  category: { id: string; name: string; slug: string };
  availableQty: number;
  seasonal: boolean;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  category: BlogCategory | null;
  featuredImage: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  area: string;
  state: string;
  fee: number;
  active: boolean;
  position: number;
}

export const categories: Category[] = [
  { id: "cat_veg", name: "Vegetables", slug: "vegetables", description: "Fresh farm vegetables" },
  { id: "cat_herbs", name: "Herbs", slug: "herbs", description: "Aromatic kitchen herbs" },
];

export const products: Product[] = [
  {
    id: "prod_red_pepper",
    slug: "red-bell-pepper",
    name: "Red Bell Pepper",
    shortDescription: "Sweet, ripe red bell peppers grown in Jos.",
    description:
      "Our red bell peppers are left to ripen fully on the vine for maximum sweetness and crunch. Grown in Jos, Plateau State and harvested at peak freshness.",
    unit: "KILOGRAM",
    price: 1600,
    compareAtPrice: null,
    status: "IN_STOCK",
    featured: true,
    image: "https://res.cloudinary.com/dxx0r7sdm/image/upload/v1787958299/red-pepper_y4fjwy.jpg",
    images: [{ url: "https://res.cloudinary.com/dxx0r7sdm/image/upload/v1787958299/red-pepper_y4fjwy.jpg", alt: "Red Bell Pepper" }],
    category: { id: "cat_veg", name: "Vegetables", slug: "vegetables" },
    availableQty: 500,
    seasonal: false,
  },
  {
    id: "prod_green_pepper",
    slug: "green-bell-pepper",
    name: "Green Bell Pepper",
    shortDescription: "Crisp, fresh green bell peppers.",
    description:
      "Crisp and mildly grassy, our green bell peppers are perfect for stir-fries, peppers and eggs, and fresh salads. Grown in Jos, Plateau State.",
    unit: "KILOGRAM",
    price: 1500,
    compareAtPrice: null,
    status: "IN_STOCK",
    featured: true,
    image: "https://res.cloudinary.com/dxx0r7sdm/image/upload/v1787958511/green_bell_pepper_ai6lsx.png",
    images: [{ url: "https://res.cloudinary.com/dxx0r7sdm/image/upload/v1787958511/green_bell_pepper_ai6lsx.png", alt: "Green Bell Pepper" }],
    category: { id: "cat_veg", name: "Vegetables", slug: "vegetables" },
    availableQty: 480,
    seasonal: false,
  },
  {
    id: "prod_yellow_pepper",
    slug: "yellow-bell-pepper",
    name: "Yellow Bell Pepper",
    shortDescription: "Bright, sweet yellow bell peppers.",
    description:
      "Mellow and sweet, our yellow bell peppers add colour and flavour to any dish. Harvested fresh from Eshcol Harvest Hub in Jos.",
    unit: "KILOGRAM",
    price: 1700,
    compareAtPrice: null,
    status: "IN_STOCK",
    featured: true,
    image: "https://res.cloudinary.com/dxx0r7sdm/image/upload/v1787958511/yellow_bell_pepper_nvaqrl.png",
    images: [{ url: "https://res.cloudinary.com/dxx0r7sdm/image/upload/v1787958511/yellow_bell_pepper_nvaqrl.png", alt: "Yellow Bell Pepper" }],
    category: { id: "cat_veg", name: "Vegetables", slug: "vegetables" },
    availableQty: 450,
    seasonal: false,
  },
  {
    id: "prod_mixed_pepper",
    slug: "mixed-bell-peppers",
    name: "Mixed Bell Peppers",
    shortDescription: "A vibrant mix of red, green and yellow peppers.",
    description:
      "Can't choose? Our mixed bell peppers combine red, green and yellow for the best of every colour and flavour — great for grilling, roasting and fresh platters.",
    unit: "KILOGRAM",
    price: 1800,
    compareAtPrice: null,
    status: "IN_STOCK",
    featured: true,
    image: "https://res.cloudinary.com/dxx0r7sdm/image/upload/v1787957606/close-up-colorful-bell-peppers_zszuwn.jpg",
    images: [{ url: "https://res.cloudinary.com/dxx0r7sdm/image/upload/v1787957606/close-up-colorful-bell-peppers_zszuwn.jpg", alt: "Mixed Bell Peppers" }],
    category: { id: "cat_veg", name: "Vegetables", slug: "vegetables" },
    availableQty: 400,
    seasonal: false,
  },
];

export const posts: Post[] = [
  {
    id: "post_seed_to_harvest",
    title: "From Seed to Harvest: Our Bell Peppers",
    slug: "seed-to-harvest-bell-peppers",
    excerpt: "A look at how we grow our bell peppers from planting to harvest.",
    content:
      "<p>At Eshcol Harvest Hub, every bell pepper begins as a carefully selected seed. We nurture our seedlings in healthy Jos soil, monitor moisture and sunlight, and harvest at peak ripeness so the flavour and crunch reach your kitchen intact.</p><p>We believe good food starts with good farming — and we are proud to share a little of that journey with you.</p>",
    status: "PUBLISHED",
    publishedAt: "2026-08-01T09:00:00.000Z",
    category: { id: "cat_farm", name: "Farm Stories", slug: "farm-stories" },
    featuredImage: "/placeholder-post.svg",
  },
];

export const deliveryZones: DeliveryZone[] = [
  {
    id: "zone_jos_1",
    name: "Jos Zone 1",
    area: "Jos",
    state: "Plateau",
    fee: 1500,
    active: true,
    position: 1,
  },
];

export function getProductBySlug(slug: string): Product | null {
  return products.find((p) => p.slug === slug) ?? null;
}

export function getPostBySlug(slug: string): Post | null {
  return posts.find((p) => p.slug === slug && p.status === "PUBLISHED") ?? null;
}

export function getPublishedPosts(): Post[] {
  return posts
    .filter((p) => p.status === "PUBLISHED")
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}
