"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/shop/CartProvider";
import { Input, Textarea, Label } from "@/components/ui/index";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { clientApiFetch } from "@/lib/api-client";

type FeeState = { fee: number; deliverable: boolean; loading: boolean };

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
  const [fee, setFee] = React.useState<FeeState>({ fee: 0, deliverable: true, loading: false });
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = React.useState("");

  const total = subtotal + (form.fulfilmentType === "DELIVERY" ? fee.fee : 0);

  React.useEffect(() => {
    if (form.fulfilmentType === "PICKUP") {
      setFee({ fee: 0, deliverable: true, loading: false });
      return;
    }
    if (form.fulfilmentType === "DELIVERY" && !form.state) return;
    const controller = new AbortController();
    setFee((f) => ({ ...f, loading: true }));
    clientApiFetch(
      `/api/v1/delivery-fee?fulfilmentType=DELIVERY&state=${encodeURIComponent(form.state)}&city=${encodeURIComponent(form.city)}`,
      { signal: controller.signal },
    )
      .then((r) => r.json())
      .then((d) => setFee({ fee: d.fee ?? 0, deliverable: d.deliverable ?? true, loading: false }))
      .catch(() => setFee((f) => ({ ...f, loading: false })));
    return () => controller.abort();
  }, [form.fulfilmentType, form.state, form.city]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    if (form.fulfilmentType === "DELIVERY" && !fee.deliverable) {
      setError("Delivery is not available to this location. Please contact the farm.");
      return;
    }
    setStatus("submitting");
    setError("");

    const payload = {
      customer: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
      },
      fulfilmentType: form.fulfilmentType,
      delivery:
        form.fulfilmentType === "DELIVERY"
          ? {
              line1: form.line1,
              city: form.city,
              state: form.state,
              directions: form.directions,
            }
          : undefined,
      notes: form.notes,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };

    try {
      const orderRes = await clientApiFetch("/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!orderRes.ok) {
        const d = await orderRes.json().catch(() => ({}));
        throw new Error(d.error || "Could not create order");
      }
      const order = await orderRes.json();

      const payRes = await clientApiFetch("/api/v1/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: order.reference, email: form.email }),
      });
      const pay = await payRes.json();
      if (!payRes.ok || !pay.authorizationUrl) {
        throw new Error(pay.error || "Could not initialize payment");
      }
      clear();
      window.location.href = pay.authorizationUrl;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
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
                {fee.loading && <p className="text-sm text-muted-foreground">Calculating delivery fee…</p>}
                {!fee.deliverable && (
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
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{formatNaira(fee.fee)}</span></div>
            )}
            <div className="flex justify-between font-semibold"><span>Total</span><span>{formatNaira(total)}</span></div>
          </div>
          {status === "error" && <p className="mt-3 text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={status === "submitting" || !fee.deliverable} className="mt-4 w-full" size="lg">
            {status === "submitting" ? "Processing…" : "Pay with Paystack"}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            You will be redirected to Paystack to complete payment securely.
          </p>
        </div>
      </form>
    </div>
  );
}
