"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, Leaf } from "lucide-react";
import { mainNav } from "./nav";
import { useCart } from "@/components/shop/CartProvider";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-px flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold">
          <Leaf className="h-6 w-6 text-primary" />
          <span>
            Eshcol <span className="text-primary">Harvest Hub</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-foreground/70 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/shop/cart"
            aria-label="Cart"
            className="relative rounded-md p-2 text-foreground/70 hover:text-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <Link href="/account/login" className="btn-outline hidden h-9 px-3 text-sm sm:inline-flex">
            Account
          </Link>
          <button
            className="md:hidden rounded-md p-2"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-px flex flex-col py-3">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/account/login" onClick={() => setOpen(false)} className="btn-outline mt-2">
              Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
