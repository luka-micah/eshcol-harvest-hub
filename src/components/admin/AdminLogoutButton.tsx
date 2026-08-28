"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { clearSessionCookie } from "@/lib/api-client";

export function AdminLogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        clearSessionCookie();
        router.push("/account/login");
        router.refresh();
      }}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground"
    >
      <LogOut className="h-4 w-4" /> Log out
    </button>
  );
}
