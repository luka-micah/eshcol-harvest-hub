import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export function buildMetadata(opts: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const title = opts.title ? `${opts.title} | ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const description = opts.description ?? SITE.supporting;
  const url = `${SITE.location ? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000" : "http://localhost:3000"}${opts.path ?? ""}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const canonical = `${appUrl}${opts.path ?? ""}`;
  const ogImage = opts.image ?? `${appUrl}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE.name,
      locale: "en_NG",
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
