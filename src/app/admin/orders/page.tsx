import { serverApiFetch } from "@/lib/server-api";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const res = await serverApiFetch("/api/v1/orders");
  const orders: any[] = (await res.json()).orders ?? [];

  const mapped = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    total: o.total,
    paymentStatus: o.paymentStatus,
    orderStatus: o.orderStatus,
    createdAt: o.createdAt,
  }));

  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold">Orders</h1>
      <div className="mt-6">
        <OrdersTable orders={mapped} />
      </div>
    </div>
  );
}

