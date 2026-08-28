"use client";

import * as React from "react";
import Link from "next/link";
import { useCart } from "@/components/shop/CartProvider";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { clientApiFetch } from "@/lib/api-client";

export default function CheckoutCallbackPage() {
  const { clear } = useCart();
  const [state, setState] = React.useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = React.useState("Verifying your payment…");

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference");
    if (!reference) {
      setState("error");
      setMessage("No payment reference found.");
      return;
    }

    clientApiFetch("/api/v1/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.status === "PAID") {
          clear();
          setState("success");
          setMessage(`Payment confirmed. Thank you for your order!`);
        } else {
          setState("error");
          setMessage(data.error || "We could not confirm your payment. Please contact us with your reference: " + reference);
        }
      })
      .catch(() => {
        setState("error");
        setMessage("Something went wrong while verifying your payment.");
      });
  }, [clear]);

  return (
    <div className="container-px flex flex-col items-center justify-center py-32 text-center">
      {state === "loading" && <p className="text-lg text-muted-foreground">{message}</p>}
      {state === "success" && (
        <>
          <CheckCircle2 className="h-16 w-16 text-green-600" />
          <h1 className="mt-4 font-heading text-3xl font-bold">Order Confirmed</h1>
          <p className="mt-2 max-w-md text-muted-foreground">{message}</p>
          <div className="mt-6 flex gap-3">
            <Link href="/shop" className="btn-primary">Continue Shopping</Link>
            <Link href="/account/orders" className="btn-outline">View Orders</Link>
          </div>
        </>
      )}
      {state === "error" && (
        <>
          <XCircle className="h-16 w-16 text-destructive" />
          <h1 className="mt-4 font-heading text-3xl font-bold">Payment Issue</h1>
          <p className="mt-2 max-w-md text-muted-foreground">{message}</p>
          <Link href="/contact" className="btn-primary mt-6">Contact Support</Link>
        </>
      )}
    </div>
  );
}
