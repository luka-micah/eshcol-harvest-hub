import { serverApiFetch } from "@/lib/server-api";
import { BulkOrderManager } from "@/components/admin/BulkOrderManager";

export const dynamic = "force-dynamic";

export default async function AdminBulkOrdersPage() {
  const res = await serverApiFetch("/api/v1/bulk-orders");
  const requests: any[] = (await res.json()).requests ?? [];

  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold">Bulk Orders</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Review enquiries from retailers and offtakers, then update their status as you progress.
      </p>
      <div className="mt-6">
        <BulkOrderManager
          requests={requests.map((r) => ({
            id: r.id,
            fullName: r.fullName,
            email: r.email,
            phone: r.phone,
            customerType: r.customerType,
            product: r.product,
            quantityRequired: r.quantityRequired,
            unit: r.unit,
            location: r.location,
            status: r.status,
            createdAt: r.createdAt,
          }))}
        />
      </div>
    </div>
  );
}

