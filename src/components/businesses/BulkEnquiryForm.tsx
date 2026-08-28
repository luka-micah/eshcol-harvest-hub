"use client";

import * as React from "react";
import { Input, Textarea, Label } from "@/components/ui/index";
import { Button } from "@/components/ui/button";
import { clientApiFetch } from "@/lib/api-client";

const customerTypes = [
  "RETAILER",
  "OFFTAKER",
  "RESTAURANT",
  "HOTEL",
  "CATERER",
  "DISTRIBUTOR",
  "OTHER",
];
const frequencies = ["ONE_TIME", "WEEKLY", "BIWEEKLY", "MONTHLY", "OTHER"];
const units = ["Kilogram", "Crate", "Bag", "Box", "Other"];

export function BulkEnquiryForm() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = React.useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await clientApiFetch("/api/v1/bulk-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="card text-center">
        <h3 className="font-heading text-xl font-semibold">Enquiry received</h3>
        <p className="mt-2 text-muted-foreground">
          Thank you. Our team will review your requirement and get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" required />
        </div>
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" name="companyName" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="customerType">Customer Type</Label>
          <select id="customerType" name="customerType" className="input" required>
            {customerTypes.map((c) => (
              <option key={c} value={c}>{c[0] + c.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="product">Product</Label>
          <Input id="product" name="product" placeholder="Bell Pepper" />
        </div>
        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <select id="frequency" name="frequency" className="input">
            {frequencies.map((f) => (
              <option key={f} value={f}>{f[0] + f.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="quantityRequired">Quantity Required</Label>
          <Input id="quantityRequired" name="quantityRequired" placeholder="e.g. 100" />
        </div>
        <div>
          <Label htmlFor="unit">Unit</Label>
          <select id="unit" name="unit" className="input">
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" placeholder="City, State" />
        </div>
      </div>
      <div>
        <Label htmlFor="additionalInfo">Additional Information</Label>
        <Textarea id="additionalInfo" name="additionalInfo" />
      </div>
      {status === "error" && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : "Submit Enquiry"}
      </Button>
    </form>
  );
}
