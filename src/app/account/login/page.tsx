"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Label } from "@/components/ui/index";
import { Button } from "@/components/ui/button";
import { clientApiFetch, setSessionCookie } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await clientApiFetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Invalid email or password");
      }
      const data = await res.json();
      if (data.token) setSessionCookie(data.token);
      router.push("/account/orders");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-px flex justify-center py-20">
      <div className="w-full max-w-md">
        <h1 className="font-heading text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to manage your orders and account.</p>
        <form onSubmit={onSubmit} className="card mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          No account? <Link href="/account/register" className="text-primary hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
