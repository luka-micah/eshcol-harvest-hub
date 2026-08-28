import { serverApiFetch } from "@/lib/server-api";
import { InventoryManager } from "@/components/admin/InventoryManager";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const res = await serverApiFetch("/api/v1/inventory");
  const items: any[] = (await res.json()).items ?? [];

  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold">Inventory</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Update available quantities. Reserved and sold quantities are tracked automatically during
        checkout.
      </p>
      <div className="mt-6">
        <InventoryManager
          items={items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            availableQty: i.availableQty,
            lowStockThreshold: i.lowStockThreshold,
          }))}
        />
      </div>
    </div>
  );
}

