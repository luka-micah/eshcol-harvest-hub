import type { Metadata } from "next";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Eshcol Harvest Hub",
  description: "Growing With Purpose — a farm in Jos, Plateau State, Nigeria.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container-px py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">About</p>
        <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Growing With Purpose</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          {SITE.name} is a farm based in Jos, Plateau State, Nigeria, focused on cultivating quality
          fresh produce and building meaningful connections between the farm and the people who depend
          on it.
        </p>
        <p className="mt-4 text-muted-foreground">
          We believe farming is more than growing crops. It is about feeding families, supporting
          businesses, creating opportunities and contributing to a stronger local food system. Our
          current focus is fresh bell pepper production, with a vision to expand our range of farm
          produce and serve an increasingly wider network of customers.
        </p>

        <h2 className="mt-12 font-heading text-2xl font-semibold">Our Story</h2>
        <p className="mt-3 text-muted-foreground">
          {SITE.name} began with a simple purpose: to grow quality food and create value through
          agriculture. From cultivation to harvest, we approach farming with patience, care and a
          commitment to quality. As we grow, we are combining agricultural practice with modern
          technology to make our produce easier to discover, order and access.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="card">
            <h3 className="font-heading text-xl font-semibold">Our Vision</h3>
            <p className="mt-2 text-muted-foreground">{SITE.vision}</p>
          </div>
          <div className="card">
            <h3 className="font-heading text-xl font-semibold">Our Mission</h3>
            <p className="mt-2 text-muted-foreground">{SITE.mission}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/produce" className={buttonClasses("primary")}>Explore Our Produce</Link>
          <Link href="/contact" className={buttonClasses("outline")}>Get in Touch</Link>
        </div>
      </div>
    </div>
  );
}
