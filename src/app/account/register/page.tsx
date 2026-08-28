"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Label } from "@/components/ui/index";
import { Button } from "@/components/ui/button";
import { clientApiFetch, setSessionCookie } from "@/lib/api-client";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      password: form.get("password"),
    };
    try {
      const res = await clientApiFetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Registration failed");
      }
      const data = await res.json();
      if (data.token) setSessionCookie(data.token);
      router.push("/account/orders");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-px flex justify-center py-20">
      <div className="w-full max-w-md">
        <h1 className="font-heading text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Track orders and reorder with ease.</p>
        <form onSubmit={onSubmit} className="card mt-6 space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={8} />
            <p className="mt-1 text-xs text-muted-foreground">At least 8 characters.</p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/account/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
