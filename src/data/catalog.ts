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
    id: "prod_bell_pepper",
    slug: "fresh-bell-pepper",
    name: "Fresh Bell Pepper",
    shortDescription: "Crisp, colourful bell peppers grown in Jos.",
    description:
      "Fresh bell peppers carefully cultivated and harvested at Eshcol Harvest Hub in Jos, Plateau State. Crisp, colourful and versatile — great raw, roasted or cooked.",
    unit: "KILOGRAM",
    price: 1500,
    compareAtPrice: null,
    status: "IN_STOCK",
    featured: true,
    image: "/placeholder-product.svg",
    images: [{ url: "/placeholder-product.svg", alt: "Fresh Bell Pepper" }],
    category: { id: "cat_veg", name: "Vegetables", slug: "vegetables" },
    availableQty: 500,
    seasonal: false,
  },
  {
    id: "prod_tomato",
    slug: "plum-tomatoes",
    name: "Plum Tomatoes",
    shortDescription: "Sweet, firm Jos plum tomatoes.",
    description:
      "Our plum tomatoes are grown under careful conditions for rich flavour and firm texture — perfect for sauces and fresh salads.",
    unit: "KILOGRAM",
    price: 1200,
    compareAtPrice: 1400,
    status: "IN_STOCK",
    featured: true,
    image: "/placeholder-product.svg",
    images: [{ url: "/placeholder-product.svg", alt: "Plum Tomatoes" }],
    category: { id: "cat_veg", name: "Vegetables", slug: "vegetables" },
    availableQty: 320,
    seasonal: false,
  },
  {
    id: "prod_lettuce",
    slug: "crisp-lettuce",
    name: "Crisp Lettuce",
    shortDescription: "Crunchy, tender lettuce heads.",
    description:
      "Tender, crunchy lettuce harvested young for the best texture in your salads and wraps.",
    unit: "PIECE",
    price: 800,
    compareAtPrice: null,
    status: "LIMITED_STOCK",
    featured: false,
    image: "/placeholder-product.svg",
    images: [{ url: "/placeholder-product.svg", alt: "Crisp Lettuce" }],
    category: { id: "cat_veg", name: "Vegetables", slug: "vegetables" },
    availableQty: 60,
    seasonal: false,
  },
  {
    id: "prod_basil",
    slug: "fresh-basil",
    name: "Fresh Basil",
    shortDescription: "Fragrant basil for your kitchen.",
    description:
      "Aromatic fresh basil grown in our herb beds — a perfect finish for peppers, tomatoes and sauces.",
    unit: "BAG",
    price: 600,
    compareAtPrice: null,
    status: "SEASONAL",
    featured: false,
    image: "/placeholder-product.svg",
    images: [{ url: "/placeholder-product.svg", alt: "Fresh Basil" }],
    category: { id: "cat_herbs", name: "Herbs", slug: "herbs" },
    availableQty: 40,
    seasonal: true,
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
