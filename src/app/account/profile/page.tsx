import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/helpers";
import { LogoutButton } from "@/components/account/LogoutButton";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const user = await requireUser();
  return (
    <div className="container-px py-12">
      <h1 className="font-heading text-3xl font-bold">My Profile</h1>
      <div className="card mt-6 max-w-lg">
        <div className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Name:</span> {user.name ?? "—"}</p>
          <p><span className="text-muted-foreground">Email:</span> {user.email}</p>
          <p><span className="text-muted-foreground">Role:</span> {user.role}</p>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
