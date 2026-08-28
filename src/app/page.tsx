import Link from "next/link";
import { Leaf, ShoppingBag, Building2, Truck, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { PLACEHOLDER_HERO_IMAGE } from "@/lib/constants";
import { buttonClasses } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { ProductCard } from "@/components/marketing/ProductCard";
import { buildMetadata } from "@/lib/seo";
import { products as allProducts } from "@/data/catalog";

export const metadata = buildMetadata({
  title: "Fresh From Our Farm. Grown With Care.",
  description: SITE.supporting,
  path: "/",
});

export default function HomePage() {
  const featured = allProducts.filter((p) => p.featured).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/60 to-background">
        <div className="container-px grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <MapPin className="h-3.5 w-3.5" /> {SITE.location}
            </span>
            <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl">
              Fresh From Our Farm. <span className="text-primary">Grown With Care.</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">{SITE.supporting}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className={buttonClasses("primary", "lg")}>
                <ShoppingBag className="h-5 w-5" /> Shop Fresh Bell Peppers
              </Link>
              <Link href="/for-businesses" className={buttonClasses("outline", "lg")}>
                <Building2 className="h-5 w-5" /> Make a Bulk Enquiry
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Farm fresh</span>
              <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Delivery & pickup</span>
              <span className="flex items-center gap-2"><Leaf className="h-4 w-4 text-primary" /> Locally grown</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl bg-primary/5 ring-1 ring-border">
              <Image
                src={PLACEHOLDER_HERO_IMAGE}
                alt="Fresh bell peppers grown at Eshcol Harvest Hub in Jos"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 384px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grown in Jos */}
      <section className="container-px py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-semibold">Grown in Jos. Delivered Fresh.</h2>
          <p className="mt-4 text-muted-foreground">
            Good food begins with good farming. At Eshcol Harvest Hub, we carefully cultivate our
            bell peppers from planting to harvest, paying attention to crop quality and freshness.
            Our goal is simple: to grow quality produce and build lasting relationships with the
            people and businesses we serve.
          </p>
        </div>
      </section>

      {/* Our Fresh Bell Peppers */}
      <section className="container-px pb-16">
        <div className="rounded-3xl bg-secondary/50 p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl font-semibold">Fresh Bell Peppers</h2>
              <p className="mt-4 text-muted-foreground">
                Our bell peppers are carefully grown and harvested to serve a variety of needs—from
                everyday family meals to restaurants, retailers and bulk buyers.
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <li>• Household purchases</li>
                <li>• Retail supply</li>
                <li>• Bulk orders</li>
                <li>• Offtake arrangements</li>
              </ul>
              <Link href="/shop" className={`${buttonClasses("primary")} mt-6`}>
                Shop Bell Peppers
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["Households", "Retailers", "Offtakers", "Farm Fresh"].map((label) => (
                <div key={label} className="rounded-xl border border-border bg-card p-4 text-center text-sm font-medium">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Audience sections */}
      <section className="container-px pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <AudienceCard
            icon={<ShoppingBag className="h-6 w-6" />}
            title="Fresh Produce for Your Home"
            body="Fresh bell peppers for your kitchen, your family and your everyday meals. Order online and choose between farm pickup and delivery."
            cta="Shop for Your Home"
            href="/shop"
          />
          <AudienceCard
            icon={<Building2 className="h-6 w-6" />}
            title="Fresh Supply for Your Business"
            body="Looking for a reliable source of fresh bell peppers for your shop or supermarket? We supply retailers with quality produce and flexible ordering."
            cta="Retail Supply Enquiry"
            href="/for-businesses"
          />
          <AudienceCard
            icon={<Truck className="h-6 w-6" />}
            title="Reliable Bulk Supply"
            body="Need larger quantities? Tell us what you need, how much and when. We'll put together a supply plan that works for you."
            cta="Request a Bulk Supply"
            href="/for-businesses"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="container-px pb-16">
        <h2 className="mb-8 text-center font-heading text-3xl font-semibold">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { n: "01", t: "Choose", d: "Browse available produce and select the quantity you need." },
            { n: "02", t: "Order", d: "Place an online order or contact us for larger requirements." },
            { n: "03", t: "Pay", d: "Pay securely online through our supported payment method." },
            { n: "04", t: "Pickup or Delivery", d: "Collect from the farm or have your order delivered." },
          ].map((s) => (
            <div key={s.n} className="card text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                {s.n}
              </div>
              <h3 className="font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="container-px pb-20">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-heading text-3xl font-semibold">Shop Our Produce</h2>
            <Link href="/shop" className="text-sm font-medium text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function AudienceCard({
  icon,
  title,
  body,
  cta,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="card flex flex-col">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-heading text-xl font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{body}</p>
      <Link href={href} className="btn-outline mt-4 self-start">
        {cta}
      </Link>
    </div>
  );
}

