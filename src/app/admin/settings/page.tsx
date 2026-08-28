import { serverApiFetch } from "@/lib/server-api";
import { DeliveryZoneManager } from "@/components/admin/DeliveryZoneManager";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const res = await serverApiFetch("/api/v1/delivery/zones");
  const zones: any[] = (await res.json()).zones ?? [];

  return (
    <div className="space-y-10 p-8">
      <section>
        <h1 className="font-heading text-2xl font-bold">Settings</h1>
        <div className="card mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><span className="text-muted-foreground">Business name:</span> {SITE.name}</div>
          <div><span className="text-muted-foreground">Location:</span> {SITE.location}</div>
          <div><span className="text-muted-foreground">Email:</span> {SITE.email}</div>
          <div><span className="text-muted-foreground">Phone:</span> {SITE.phone}</div>
        </div>
      </section>

      <section>
        <h2 className="font-heading text-xl font-semibold">Delivery Zones & Pricing</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure delivery fees by zone. Farm pickup is always free. Prices are never hard-coded in
          the frontend.
        </p>
        <div className="mt-4">
          <DeliveryZoneManager zones={zones} />
        </div>
      </section>
    </div>
  );
}

