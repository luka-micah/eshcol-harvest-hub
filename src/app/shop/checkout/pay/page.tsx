"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Label } from "@/components/ui/index";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";

function PayInner() {
  const router = useRouter();
  const sp = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const name = sp.get("name") || "";
  const phone = sp.get("phone") || "";
  const total = Number(sp.get("total") || "0");
  const summary = sp.get("summary") || "";

  const [card, setCard] = React.useState({ holder: "", number: "", expiry: "", cvv: "" });
  const [status, setStatus] = React.useState<"idle" | "processing">("idle");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("processing");
    // Demo only: no real payment is processed. Simulate success and confirm.
    setTimeout(() => {
      router.push("/shop/checkout/callback?status=success");
    }, 800);
  }

  return (
    <div className="container-px py-12">
      <h1 className="font-heading text-3xl font-bold">Complete Payment</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="card h-fit space-y-4 lg:col-span-2">
          <h2 className="font-heading text-lg font-semibold">Card Details</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="holder">Cardholder Name</Label>
              <Input id="holder" required value={card.holder} onChange={(e) => setCard({ ...card, holder: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="number">Card Number</Label>
              <Input id="number" inputMode="numeric" required placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                <Input id="expiry" required placeholder="12/28" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" inputMode="numeric" required placeholder="123" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} />
              </div>
            </div>
            <Button type="submit" disabled={status === "processing"} size="lg" className="w-full">
              {status === "processing" ? "Processing…" : `Pay ${formatNaira(total)}`}
            </Button>
            <p className="text-xs text-muted-foreground">Demo form — no real card is charged.</p>
          </form>
        </div>

        <div className="card h-fit space-y-3">
          <h2 className="font-heading text-lg font-semibold">Order Summary</h2>
          {summary ? (
            <p className="whitespace-pre-line text-sm text-muted-foreground">{summary}</p>
          ) : (
            <div className="text-sm text-muted-foreground">
              <p>{name}</p>
              <p>{phone}</p>
              <p className="font-semibold text-foreground">Total: {formatNaira(total)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<div className="container-px py-20 text-center text-muted-foreground">Loading…</div>}>
      <PayInner />
    </Suspense>
  );
}
