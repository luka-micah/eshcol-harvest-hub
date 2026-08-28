import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { serverApiFetch } from "@/lib/server-api";
import { AddToCartPanel } from "@/components/shop/AddToCartPanel";
import { Badge } from "@/components/ui/index";
import { formatNaira } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pres = await serverApiFetch("/api/v1/products/" + slug);
  const product = pres.ok ? (await pres.json()).product : null;
  if (!product) return buildMetadata({ title: "Product not found" });
  return buildMetadata({
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.shortDescription ?? product.description ?? "",
    path: `/shop/${product.slug}`,
    image: product.images[0]?.url,
  });
}

const statusLabel: Record<string, string> = {
  IN_STOCK: "In Stock",
  LIMITED_STOCK: "Limited Stock",
  COMING_SOON: "Coming Soon",
  SEASONAL: "Seasonal",
  SOLD_OUT: "Sold Out",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pres = await serverApiFetch("/api/v1/products/" + slug);
  const product = pres.ok ? (await pres.json()).product : null;
  if (!product) notFound();

  const availableQty = product.inventory ? product.inventory.availableQty : 0;
  const soldOut = product.status === "SOLD_OUT" || availableQty <= 0;

  return (
    <div className="container-px py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-secondary/40 ring-1 ring-border">
          <Image
            src={product.images[0]?.url ?? PLACEHOLDER_PRODUCT_IMAGE}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">{product.category.name}</p>
          <h1 className="mt-1 font-heading text-3xl font-bold">{product.name}</h1>
          <div className="mt-3">
            <Badge tone={soldOut ? "danger" : "success"}>{statusLabel[product.status] ?? product.status}</Badge>
          </div>
          <p className="mt-4 text-muted-foreground">{product.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-muted/50 p-3"><dt className="text-muted-foreground">Origin</dt><dd className="font-medium">Eshcol Harvest Hub, Jos</dd></div>
            <div className="rounded-lg bg-muted/50 p-3"><dt className="text-muted-foreground">Unit</dt><dd className="font-medium">{product.unit}</dd></div>
            <div className="rounded-lg bg-muted/50 p-3"><dt className="text-muted-foreground">Pickup</dt><dd className="font-medium">Available</dd></div>
            <div className="rounded-lg bg-muted/50 p-3"><dt className="text-muted-foreground">Delivery</dt><dd className="font-medium">Available</dd></div>
          </dl>

          <div className="mt-6">
            <AddToCartPanel
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                unitPrice: product.price,
                unit: product.unit,
                image: product.images[0]?.url ?? null,
                availableQty,
                soldOut,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
