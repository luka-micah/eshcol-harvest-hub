"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clearSessionCookie } from "@/lib/api-client";

export function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      className="mt-6"
      onClick={() => {
        clearSessionCookie();
        router.push("/");
        router.refresh();
      }}
    >
      Log out
    </Button>
  );
}
