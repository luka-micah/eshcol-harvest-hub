import type { Metadata } from "next";
import { ProductCard } from "@/components/marketing/ProductCard";
import { buildMetadata } from "@/lib/seo";
import { products } from "@/data/catalog";

export const metadata: Metadata = buildMetadata({
  title: "Shop Fresh Produce",
  description: "Order fresh bell peppers online with farm pickup or delivery.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <div className="container-px py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Shop</p>
        <h1 className="mt-2 font-heading text-4xl font-bold">Fresh From the Farm</h1>
        <p className="mt-4 text-muted-foreground">
          Choose your quantity, add to cart and choose farm pickup or delivery at checkout.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="card mt-6 text-center text-muted-foreground">
          Our shop is getting ready. Please check back soon.
        </div>
      )}
    </div>
  );
}
