"use client";

import * as React from "react";
import { Input, Textarea, Label } from "@/components/ui/index";
import { Button } from "@/components/ui/button";
import { clientApiFetch } from "@/lib/api-client";

export function ContactForm() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = React.useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      subject: form.get("subject"),
      message: form.get("message"),
    };
    try {
      const res = await clientApiFetch("/api/v1/contact", {
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
        <h3 className="font-heading text-xl font-semibold">Thank you!</h3>
        <p className="mt-2 text-muted-foreground">
          Your message has been received. We will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" placeholder="+234..." />
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" required placeholder="How can we help?" />
        </div>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required placeholder="Tell us more..." />
      </div>
      {status === "error" && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
