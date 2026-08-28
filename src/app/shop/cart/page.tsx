"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/shop/CartProvider";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/constants";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, loaded } = useCart();

  if (!loaded) {
    return <div className="container-px py-20 text-center text-muted-foreground">Loading cart…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container-px py-20 text-center">
        <h1 className="font-heading text-3xl font-bold">Your Cart</h1>
        <p className="mt-3 text-muted-foreground">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary mt-6">Browse Produce</Link>
      </div>
    );
  }

  return (
    <div className="container-px py-12">
      <h1 className="font-heading text-3xl font-bold">Your Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary/40">
                <Image src={item.image ?? PLACEHOLDER_PRODUCT_IMAGE} alt={item.name} fill className="object-cover" sizes="80px" />
              </div>
              <div className="flex-1">
                <Link href={`/shop/${item.slug}`} className="font-medium hover:text-primary">
                  {item.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {formatNaira(item.unitPrice)} / {item.unit.toLowerCase()}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    className="h-8 w-8 rounded-md border border-border"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-10 text-center">{item.quantity}</span>
                  <button
                    className="h-8 w-8 rounded-md border border-border"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <button
                    className="ml-2 text-sm text-destructive hover:underline"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right font-semibold">
                {formatNaira(item.unitPrice * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="card h-fit">
          <h2 className="font-heading text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatNaira(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Delivery fee calculated at checkout.</p>
          <Link href="/shop/checkout" className="btn-primary mt-6 w-full">
            Proceed to Checkout
          </Link>
          <Link href="/shop" className="btn-outline mt-2 w-full">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
