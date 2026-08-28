"use client";

import * as React from "react";
import Link from "next/link";
import { useCart } from "@/components/shop/CartProvider";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutCallbackPage() {
  const { clear } = useCart();
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    clear();
    setDone(true);
  }, [clear]);

  return (
    <div className="container-px flex flex-col items-center justify-center py-32 text-center">
      {done && (
        <>
          <CheckCircle2 className="h-16 w-16 text-green-600" />
          <h1 className="mt-4 font-heading text-3xl font-bold">Order Confirmed</h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            Thank you for your order! This is a demo store, so no real payment was processed.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/shop" className="btn-primary">Continue Shopping</Link>
            <Link href="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </>
      )}
    </div>
  );
}
