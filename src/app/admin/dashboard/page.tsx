import Link from "next/link";
import { serverApiFetch } from "@/lib/server-api";
import { formatNaira, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getJson(path: string) {
  const res = await serverApiFetch(path);
  return res.json();
}

export default async function AdminDashboard() {
  const [ordersData, customersData, bulkData, inventoryData, productsData] = await Promise.all([
    getJson("/api/v1/orders"),
    getJson("/api/v1/customers"),
    getJson("/api/v1/bulk-orders"),
    getJson("/api/v1/inventory"),
    getJson("/api/v1/products?all=1"),
  ]);

  const orders: any[] = ordersData.orders ?? [];
  const customers: any[] = customersData.customers ?? [];
  const bulk: any[] = bulkData.requests ?? [];
  const inventory: any[] = inventoryData.items ?? [];
  const products: any[] = productsData.products ?? [];

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const paid = orders.filter((o) => o.paymentStatus === "PAID");
  const totalSales = paid.reduce((s: number, o: any) => s + Number(o.total || 0), 0);
  const salesToday = paid
    .filter((o) => new Date(o.createdAt) >= startOfToday)
    .reduce((s: number, o: any) => s + Number(o.total || 0), 0);
  const pending = orders.filter((o) =>
    ["PAID", "PROCESSING", "READY", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY"].includes(o.orderStatus),
  ).length;
  const ordersToday = orders.filter((o) => new Date(o.createdAt) >= startOfToday).length;
  const bulkOpen = bulk.filter((r) =>
    ["NEW", "REVIEWING", "CONTACTED", "QUOTED"].includes(r.status),
  ).length;
  const lowStock = inventory.filter((i) => Number(i.availableQty) <= Number(i.lowStockThreshold));
  const recent = orders.slice(0, 8);

  const stats = [
    { label: "Total Sales", value: formatNaira(totalSales) },
    { label: "Sales Today", value: formatNaira(salesToday) },
    { label: "Pending Orders", value: String(pending) },
    { label: "Orders Today", value: String(ordersToday) },
    { label: "Active Customers", value: String(customers.length) },
    { label: "Bulk Enquiries", value: String(bulkOpen) },
    { label: "Low-Stock Products", value: String(lowStock.length) },
    { label: "Available Products", value: String(products.length) },
  ];

  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-heading text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="card">
          <h2 className="font-heading text-lg font-semibold">Recent Orders</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {recent.map((o) => (
              <li key={o.id} className="flex items-center justify-between border-b border-border pb-2">
                <div>
                  <Link href={`/admin/orders`} className="font-medium hover:text-primary">{o.orderNumber}</Link>
                  <p className="text-muted-foreground">{o.customerName} · {formatDate(o.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatNaira(o.total)}</p>
                  <p className="text-xs text-muted-foreground">{o.orderStatus}</p>
                </div>
              </li>
            ))}
            {recent.length === 0 && <li className="text-muted-foreground">No orders yet.</li>}
          </ul>
        </section>

        <section className="card">
          <h2 className="font-heading text-lg font-semibold">Low Stock Alert</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-medium">{p.name}</span>
                <span className="text-muted-foreground">{Number(p.availableQty)} left</span>
              </li>
            ))}
            {lowStock.length === 0 && <li className="text-muted-foreground">All products sufficiently stocked.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}

