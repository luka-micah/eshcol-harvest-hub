import Link from "next/link";
import { Leaf, MapPin, Phone, Mail } from "lucide-react";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary/40">
      <div className="container-px grid gap-8 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-heading text-lg font-bold">
            <Leaf className="h-5 w-5 text-primary" />
            Eshcol Harvest Hub
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{SITE.supporting}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/produce" className="hover:text-primary">Our Produce</Link></li>
            <li><Link href="/shop" className="hover:text-primary">Shop</Link></li>
            <li><Link href="/for-businesses" className="hover:text-primary">For Businesses</Link></li>
            <li><Link href="/farm-journal" className="hover:text-primary">Farm Journal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="/produce" className="hover:text-primary">Our Produce</Link></li>
            <li><Link href="/shop" className="hover:text-primary">Shop</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {SITE.location}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> {SITE.phone}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> {SITE.email}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4">
        <p className="container-px text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name}. {SITE.tagline}
        </p>
      </div>
    </footer>
  );
}
