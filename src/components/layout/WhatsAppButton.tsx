"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { whatsappUrl, WHATSAPP_MESSAGE } from "@/lib/constants";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl(WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
