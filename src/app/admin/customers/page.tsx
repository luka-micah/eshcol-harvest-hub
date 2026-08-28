import { serverApiFetch } from "@/lib/server-api";
import { Badge } from "@/components/ui/index";
import { formatNaira, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const res = await serverApiFetch("/api/v1/customers");
  const customers: any[] = (await res.json()).customers ?? [];

  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold">Customers</h1>
      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Type</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3 font-medium">{c.name ?? "—"}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3"><Badge tone="info">{c.customerType}</Badge></td>
                <td className="p-3">{c.orderCount}</td>
                <td className="p-3">{formatNaira(c.totalSpent)}</td>
                <td className="p-3 text-muted-foreground">{c.lastOrder ? formatDate(c.lastOrder) : "—"}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No customers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

