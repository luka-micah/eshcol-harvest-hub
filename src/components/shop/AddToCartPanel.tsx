"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/shop/CartProvider";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { BELL_PEPPER_QUANTITIES } from "@/lib/constants";

export function AddToCartPanel({
  product,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    unitPrice: number;
    unit: string;
    image: string | null;
    availableQty: number;
    soldOut: boolean;
  };
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [qty, setQty] = React.useState(1);
  const [custom, setCustom] = React.useState("");

  const effectiveQty = custom ? Number(custom) : qty;
  const max = Math.max(1, Math.floor(product.availableQty));

  function handleAdd() {
    if (product.soldOut) return;
    const quantity = custom ? Number(custom) : qty;
    if (!Number.isFinite(quantity) || quantity <= 0) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      unitPrice: product.unitPrice,
      unit: product.unit,
      image: product.image,
      quantity,
      maxQuantity: max,
    });
    router.push("/shop/cart");
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium">Select quantity ({product.unit.toLowerCase()})</p>
        <div className="flex flex-wrap gap-2">
          {BELL_PEPPER_QUANTITIES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                setQty(q);
                setCustom("");
              }}
              className={`rounded-md border px-4 py-2 text-sm font-medium ${
                !custom && qty === q
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted"
              } ${q > max && !custom ? "opacity-40" : ""}`}
              disabled={q > max}
            >
              {q}kg
            </button>
          ))}
          <input
            type="number"
            min={1}
            placeholder="Custom"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="input w-28"
            aria-label="Custom quantity"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-heading text-2xl font-bold text-primary">
          {formatNaira(product.unitPrice * (effectiveQty || 1))}
        </span>
        <span className="text-sm text-muted-foreground">
          {formatNaira(product.unitPrice)} / {product.unit.toLowerCase()}
        </span>
      </div>

      <Button onClick={handleAdd} disabled={product.soldOut || !(effectiveQty > 0)} size="lg" className="w-full">
        {product.soldOut ? "Sold Out" : "Add to Cart"}
      </Button>
      {!product.soldOut && product.availableQty <= 0 && (
        <p className="text-sm text-muted-foreground">Stock is being updated. Please contact us for availability.</p>
      )}
    </div>
  );
}
