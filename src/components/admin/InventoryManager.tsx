"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { clientApiFetch } from "@/lib/api-client";

export function InventoryManager({
  items,
}: {
  items: { id: string; name: string; price: number; availableQty: number; lowStockThreshold: number }[];
}) {
  const router = useRouter();
  const [values, setValues] = React.useState<Record<string, string>>(
    Object.fromEntries(items.map((i) => [i.id, String(i.availableQty)])),
  );

  async function save(id: string) {
    await clientApiFetch("/api/v1/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id, availableQty: Number(values[id]) }),
    });
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="p-3">Product</th>
            <th className="p-3">Price</th>
            <th className="p-3">Available Qty</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id} className="border-t border-border">
              <td className="p-3 font-medium">{i.name}</td>
              <td className="p-3">{formatNaira(i.price)}</td>
              <td className="p-3">
                <input
                  type="number"
                  className="input h-9 w-28"
                  value={values[i.id]}
                  onChange={(e) => setValues((v) => ({ ...v, [i.id]: e.target.value }))}
                />
              </td>
              <td className="p-3">
                <Button size="sm" onClick={() => save(i.id)}>Update</Button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={4} className="p-4 text-center text-muted-foreground">No products to manage.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
