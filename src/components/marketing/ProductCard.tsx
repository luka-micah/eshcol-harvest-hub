import Link from "next/link";
import Image from "next/image";
import { formatNaira } from "@/lib/utils";
import { Badge } from "@/components/ui/index";
import type { Product } from "@/data/catalog";
import { PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/constants";

const statusTone: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  IN_STOCK: "success",
  LIMITED_STOCK: "warning",
  COMING_SOON: "info",
  SEASONAL: "info",
  SOLD_OUT: "danger",
};

const statusLabel: Record<string, string> = {
  IN_STOCK: "In Stock",
  LIMITED_STOCK: "Limited Stock",
  COMING_SOON: "Coming Soon",
  SEASONAL: "Seasonal",
  SOLD_OUT: "Sold Out",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary/40">
        <Image
          src={product.image ?? PLACEHOLDER_PRODUCT_IMAGE}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {product.featured && (
          <span className="absolute left-3 top-3">
            <Badge tone="success">Featured</Badge>
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{product.name}</h3>
          <Badge tone={statusTone[product.status] ?? "default"}>
            {statusLabel[product.status] ?? product.status}
          </Badge>
        </div>
        {product.shortDescription && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-heading text-lg font-bold text-primary">
            {formatNaira(product.price)}
            <span className="text-xs font-normal text-muted-foreground"> / {product.unit.toLowerCase()}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
