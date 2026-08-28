import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/helpers";
import { serverApiFetch } from "@/lib/server-api";
import { Badge } from "@/components/ui/index";
import { formatNaira, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "My Orders" };

export default async function OrdersPage() {
  await requireUser();
  const res = await serverApiFetch("/api/v1/orders");
  const orders: any[] = (await res.json()).orders ?? [];

  return (
    <div className="container-px py-12">
      <h1 className="font-heading text-3xl font-bold">My Orders</h1>
      {orders.length === 0 ? (
        <div className="card mt-6 text-center text-muted-foreground">
          <p>You have no orders yet.</p>
          <Link href="/shop" className="btn-primary mt-4">Start Shopping</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{o.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(o.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={o.paymentStatus === "PAID" ? "success" : "warning"}>{o.paymentStatus}</Badge>
                  <Badge tone="default">{o.orderStatus}</Badge>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {o.items.map((i: any) => (
                  <li key={i.id}>{i.productNameSnapshot} × {i.quantity} {i.unit} — {formatNaira(i.lineTotal)}</li>
                ))}
              </ul>
              <p className="mt-3 font-semibold">Total: {formatNaira(o.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

