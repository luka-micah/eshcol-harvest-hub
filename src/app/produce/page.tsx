import type { Metadata } from "next";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { ProductCard } from "@/components/marketing/ProductCard";
import { buildMetadata } from "@/lib/seo";
import { products } from "@/data/catalog";

export const metadata: Metadata = buildMetadata({
  title: "Our Produce",
  description: "Fresh From Eshcol Harvest Hub — quality bell peppers grown in Jos.",
  path: "/produce",
});

export default function ProducePage() {
  return (
    <div className="container-px py-12 sm:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Our Produce</p>
        <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Fresh From Eshcol Harvest Hub</h1>
        <p className="mt-4 text-muted-foreground">
          Our produce catalogue is designed to grow with us. We currently focus on fresh bell peppers,
          with more farm produce arriving in the future.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="font-heading text-2xl font-semibold">Vegetables</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {products.length === 0 && (
          <div className="card mt-6 text-center text-muted-foreground">
            <Leaf className="mx-auto mb-3 h-8 w-8 text-primary" />
            Our first harvest is coming soon. Check back shortly.
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <Link href="/shop" className={buttonClasses("primary", "lg")}>Shop All Produce</Link>
      </div>
    </div>
  );
}
