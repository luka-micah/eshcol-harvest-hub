import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Hotel, Store, Truck } from "lucide-react";
import { BulkEnquiryForm } from "@/components/businesses/BulkEnquiryForm";
import { buttonClasses } from "@/components/ui/button";
import { whatsappUrl, WHATSAPP_BULK_MESSAGE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "For Businesses — Retailers & Offtakers",
  description: "Reliable fresh bell pepper supply for retailers, restaurants, hotels and bulk buyers.",
  path: "/for-businesses",
});

export default function ForBusinessesPage() {
  return (
    <div className="container-px py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">For Businesses</p>
        <h1 className="mt-2 font-heading text-4xl font-bold">Fresh Supply, Built for Business</h1>
        <p className="mt-4 text-muted-foreground">
          Whether you run a shop, restaurant, hotel or food business, Eshcol Harvest Hub supplies
          quality bell peppers with reliable, flexible ordering. Tell us what you need and we&apos;ll
          put together a supply plan.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Segment
          icon={<Store className="h-6 w-6" />}
          title="Retailers"
          body="Grocery stores and supermarkets — consistent supply, bulk pricing and delivery to your shop."
          cta="Retail Supply Enquiry"
        />
        <Segment
          icon={<Hotel className="h-6 w-6" />}
          title="Offtakers"
          body="Restaurants, hotels, caterers and distributors — large quantities and negotiated pricing."
          cta="Offtaker Enquiry"
        />
        <Segment
          icon={<Building2 className="h-6 w-6" />}
          title="Bulk Buyers"
          body="Tell us your volume, frequency and location. We'll respond with availability and a quote."
          cta="Bulk Supply Enquiry"
        />
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-heading text-2xl font-semibold">Why work with Eshcol Harvest Hub?</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li className="flex gap-2"><Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> Farm-fresh produce, harvested with care.</li>
            <li className="flex gap-2"><Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> Reliable supply for recurring needs.</li>
            <li className="flex gap-2"><Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> Transparent pricing and flexible quantities.</li>
            <li className="flex gap-2"><Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> Local sourcing from Jos, Plateau State.</li>
          </ul>
          <a href={whatsappUrl(WHATSAPP_BULK_MESSAGE)} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline", "md") + " mt-6"}>
            Chat on WhatsApp
          </a>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold">Supply Enquiry</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete the form and our team will be in touch.
          </p>
          <div className="mt-4">
            <BulkEnquiryForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function Segment({ icon, title, body, cta }: { icon: React.ReactNode; title: string; body: string; cta: string }) {
  return (
    <div className="card flex flex-col">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-heading text-xl font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{body}</p>
      <a href="#enquiry" className="btn-outline mt-4 self-start">{cta}</a>
    </div>
  );
}
