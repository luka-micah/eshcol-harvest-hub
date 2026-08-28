import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { buttonClasses } from "@/components/ui/button";
import { whatsappUrl, WHATSAPP_MESSAGE, SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description: "Let's talk about fresh produce, bulk supply, pickup or delivery.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container-px py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Contact</p>
        <h1 className="mt-2 font-heading text-4xl font-bold">Let&apos;s Talk</h1>
        <p className="mt-4 text-muted-foreground">
          Have a question about our produce, bulk supply, pickup or delivery? We would love to hear
          from you.
        </p>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-3">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{SITE.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageCircle className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">WhatsApp</p>
              <a href={whatsappUrl(WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                Chat with us
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{SITE.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Farm Location</p>
              <p className="text-sm text-muted-foreground">{SITE.farmAddress}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
