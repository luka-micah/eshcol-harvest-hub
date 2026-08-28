"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/shop/CartProvider";
import { Input, Textarea, Label } from "@/components/ui/index";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { deliveryZones } from "@/data/catalog";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear, loaded } = useCart();

  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    fulfilmentType: "DELIVERY" as "PICKUP" | "DELIVERY",
    line1: "",
    city: "",
    state: "Plateau",
    directions: "",
    notes: "",
  });
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = React.useState("");

  const zone = deliveryZones.find(
    (z) => z.active && z.state.toLowerCase() === form.state.toLowerCase(),
  );
  const fee = form.fulfilmentType === "DELIVERY" && zone ? zone.fee : 0;
  const deliverable = form.fulfilmentType === "PICKUP" || !!zone;
  const total = subtotal + fee;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    if (form.fulfilmentType === "DELIVERY" && !deliverable) {
      setError("Delivery is not available to this location. Please contact the farm.");
      return;
    }
    setStatus("submitting");
    // Demo only: no backend/payment is wired up. Clear the cart and show confirmation.
    clear();
    router.push("/shop/checkout/callback?status=success");
  }

  if (!loaded) {
    return <div className="container-px py-20 text-center text-muted-foreground">Loading…</div>;
  }
  if (items.length === 0) {
    return (
      <div className="container-px py-20 text-center">
        <h1 className="font-heading text-3xl font-bold">Checkout</h1>
        <p className="mt-3 text-muted-foreground">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary mt-6">Browse Produce</Link>
      </div>
    );
  }

  return (
    <div className="container-px py-12">
      <h1 className="font-heading text-3xl font-bold">Checkout</h1>
      <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card space-y-4">
            <h2 className="font-heading text-lg font-semibold">Your Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </section>

          <section className="card space-y-4">
            <h2 className="font-heading text-lg font-semibold">Fulfilment</h2>
            <div className="flex gap-3">
              {(["DELIVERY", "PICKUP"] as const).map((t) => (
                <label
                  key={t}
                  className={`flex-1 cursor-pointer rounded-lg border p-3 text-sm font-medium ${
                    form.fulfilmentType === t ? "border-primary bg-primary/10 text-primary" : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="fulfilment"
                    className="mr-2"
                    checked={form.fulfilmentType === t}
                    onChange={() => setForm({ ...form, fulfilmentType: t })}
                  />
                  {t === "DELIVERY" ? "Delivery" : "Farm Pickup"}
                </label>
              ))}
            </div>

            {form.fulfilmentType === "DELIVERY" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="line1">Address</Label>
                  <Input id="line1" required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="city">City / Area</Label>
                  <Input id="city" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="directions">Additional directions</Label>
                  <Textarea id="directions" value={form.directions} onChange={(e) => setForm({ ...form, directions: e.target.value })} />
                </div>
                {!deliverable && (
                  <p className="text-sm text-destructive">Outside service area — please contact the farm.</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Pickup is free. We will notify you when your order is ready for collection at the farm.
              </p>
            )}
          </section>
        </div>

        <div className="card h-fit">
          <h2 className="font-heading text-lg font-semibold">Order Summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between">
                <span>{i.name} × {i.quantity}</span>
                <span>{formatNaira(i.unitPrice * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatNaira(subtotal)}</span></div>
            {form.fulfilmentType === "DELIVERY" && (
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{formatNaira(fee)}</span></div>
            )}
            <div className="flex justify-between font-semibold"><span>Total</span><span>{formatNaira(total)}</span></div>
          </div>
          {status === "error" && <p className="mt-3 text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={status === "submitting" || !deliverable} className="mt-4 w-full" size="lg">
            {status === "submitting" ? "Processing…" : "Place Order"}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Demo store — no real payment is processed.
          </p>
        </div>
      </form>
    </div>
  );
}
