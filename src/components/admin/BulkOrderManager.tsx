"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/index";
import { formatDate } from "@/lib/utils";
import { clientApiFetch } from "@/lib/api-client";

const STATUSES = [
  "NEW",
  "REVIEWING",
  "CONTACTED",
  "QUOTED",
  "AGREED",
  "FULFILLING",
  "COMPLETED",
  "CANCELLED",
];

export function BulkOrderManager({ requests }: { requests: any[] }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState<string | null>(null);

  async function update(id: string, status: string) {
    setBusy(id);
    await clientApiFetch(`/api/v1/bulk-orders/${id}`, {
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
            <th className="p-3">Name</th>
            <th className="p-3">Type</th>
            <th className="p-3">Product / Qty</th>
            <th className="p-3">Location</th>
            <th className="p-3">Received</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="border-t border-border align-top">
              <td className="p-3">
                <div className="font-medium">{r.fullName}</div>
                <div className="text-xs text-muted-foreground">{r.email} · {r.phone}</div>
              </td>
              <td className="p-3"><Badge tone="info">{r.customerType}</Badge></td>
              <td className="p-3">{r.product ?? "—"} / {r.quantityRequired ?? "—"} {r.unit ?? ""}</td>
              <td className="p-3 text-muted-foreground">{r.location ?? "—"}</td>
              <td className="p-3 text-muted-foreground">{formatDate(r.createdAt)}</td>
              <td className="p-3">
                <select
                  className="input h-9"
                  disabled={busy === r.id}
                  value={r.status}
                  onChange={(e) => update(r.id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {requests.length === 0 && (
            <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No bulk enquiries yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
