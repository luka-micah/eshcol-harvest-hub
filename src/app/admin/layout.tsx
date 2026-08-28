import Link from "next/link";
import { requireAdmin } from "@/lib/auth/helpers";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/bulk-orders", label: "Bulk Orders", icon: MessageSquare },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-secondary/40 md:block">
        <div className="px-6 py-5 font-heading text-lg font-bold">
          Eshcol <span className="text-primary">Admin</span>
        </div>
        <nav className="px-3 pb-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <AdminLogoutButton />
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
