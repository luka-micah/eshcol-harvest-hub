"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/index";
import { Badge } from "@/components/ui/index";
import { formatNaira } from "@/lib/utils";
import { clientApiFetch } from "@/lib/api-client";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  unit: string;
  status: string;
  published: boolean;
  availableQty: number;
};

export function AdminProducts({
  products,
  categories,
}: {
  products: Product[];
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [unit, setUnit] = React.useState("KILOGRAM");
  const [categoryId, setCategoryId] = React.useState(categories[0]?.id ?? "");
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    try {
      const res = await clientApiFetch("/api/v1/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          price: Number(price),
          unit,
          categoryId,
          status: "IN_STOCK",
          published: true,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Create failed");
      }
      setName("");
      setPrice("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    await clientApiFetch(`/api/v1/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold">Products</h1>

      <form onSubmit={create} className="card mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Fresh Bell Pepper" />
        </div>
        <div>
          <Label htmlFor="price">Price (₦)</Label>
          <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="1500" />
        </div>
        <div>
          <Label htmlFor="unit">Unit</Label>
          <select id="unit" className="input" value={unit} onChange={(e) => setUnit(e.target.value)}>
            {["KILOGRAM", "GRAM", "PIECE", "CRATE", "BAG", "BOX", "CUSTOM"].map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <select id="category" className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Saving…" : "Add Product"}
          </Button>
        </div>
        {error && <p className="text-sm text-destructive sm:col-span-2 lg:col-span-5">{error}</p>}
      </form>

      <div className="mt-8 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{formatNaira(p.price)}</td>
                <td className="p-3">{p.availableQty}</td>
                <td className="p-3"><Badge tone={p.published ? "success" : "default"}>{p.status}</Badge></td>
                <td className="p-3">
                  <Button variant="outline" size="sm" onClick={() => remove(p.id)}>Delete</Button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">No products yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
