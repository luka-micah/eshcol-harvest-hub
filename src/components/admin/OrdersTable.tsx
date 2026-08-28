"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/index";
import { formatNaira, formatDate } from "@/lib/utils";
import { clientApiFetch } from "@/lib/api-client";

const STATUSES = [
  "PENDING",
  "PAYMENT_PENDING",
  "PAID",
  "PROCESSING",
  "READY",
  "OUT_FOR_DELIVERY",
  "READY_FOR_PICKUP",
  "DELIVERED",
  "PICKED_UP",
  "CANCELLED",
  "FAILED",
];

export function OrdersTable({ orders }: { orders: any[] }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState<string | null>(null);

  async function update(id: string, status: string) {
    setBusy(id);
    await clientApiFetch(`/api/v1/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="p-3">Order</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Total</th>
            <th className="p-3">Payment</th>
            <th className="p-3">Status</th>
            <th className="p-3">Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t border-border">
              <td className="p-3">
                <div className="font-medium">{o.orderNumber}</div>
                <div className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</div>
              </td>
              <td className="p-3">{o.customerName}</td>
              <td className="p-3">{formatNaira(o.total)}</td>
              <td className="p-3"><Badge tone={o.paymentStatus === "PAID" ? "success" : "warning"}>{o.paymentStatus}</Badge></td>
              <td className="p-3"><Badge tone="default">{o.orderStatus}</Badge></td>
              <td className="p-3">
                <select
                  className="input h-9"
                  disabled={busy === o.id}
                  value={o.orderStatus}
                  onChange={(e) => update(o.id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No orders yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
