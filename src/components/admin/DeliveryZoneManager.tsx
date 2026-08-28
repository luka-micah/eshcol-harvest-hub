"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/index";
import { formatNaira } from "@/lib/utils";
import { clientApiFetch } from "@/lib/api-client";

export function DeliveryZoneManager({ zones }: { zones: any[] }) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [area, setArea] = React.useState("");
  const [state, setState] = React.useState("Plateau");
  const [fee, setFee] = React.useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await clientApiFetch("/api/v1/delivery-zones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, area, state, fee: Number(fee) }),
    });
    setName("");
    setArea("");
    setFee("");
    router.refresh();
  }

  async function toggle(id: string, active: boolean) {
    await clientApiFetch(`/api/v1/delivery-zones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="card grid gap-4 sm:grid-cols-5">
        <div>
          <Label htmlFor="zname">Name</Label>
          <Input id="zname" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jos Zone 1" />
        </div>
        <div>
          <Label htmlFor="zarea">Area</Label>
          <Input id="zarea" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Jos" />
        </div>
        <div>
          <Label htmlFor="zstate">State</Label>
          <Input id="zstate" value={state} onChange={(e) => setState(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="zfee">Fee (₦)</Label>
          <Input id="zfee" type="number" value={fee} onChange={(e) => setFee(e.target.value)} required placeholder="0" />
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full">Add Zone</Button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Zone</th>
              <th className="p-3">Area</th>
              <th className="p-3">State</th>
              <th className="p-3">Fee</th>
              <th className="p-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z) => (
              <tr key={z.id} className="border-t border-border">
                <td className="p-3 font-medium">{z.name}</td>
                <td className="p-3 text-muted-foreground">{z.area ?? "—"}</td>
                <td className="p-3 text-muted-foreground">{z.state}</td>
                <td className="p-3">{formatNaira(z.fee)}</td>
                <td className="p-3">
                  <Button size="sm" variant={z.active ? "primary" : "outline"} onClick={() => toggle(z.id, z.active)}>
                    {z.active ? "Active" : "Inactive"}
                  </Button>
                </td>
              </tr>
            ))}
            {zones.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">No delivery zones configured.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
