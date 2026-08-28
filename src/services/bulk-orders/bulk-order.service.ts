import { prisma } from "@/lib/db";
import type { BulkOrderRequest } from "@prisma/client";
import { sendEmail, brandedEmail } from "@/lib/email/resend";
import { SITE } from "@/lib/constants";

export async function createBulkOrder(data: {
  fullName: string;
  companyName?: string;
  phone: string;
  email: string;
  customerType: string;
  product?: string;
  quantityRequired?: string;
  unit?: string;
  location?: string;
  preferredDate?: string;
  frequency?: string;
  additionalInfo?: string;
}) {
  const request = await prisma.bulkOrderRequest.create({
    data: {
      fullName: data.fullName,
      companyName: data.companyName,
      phone: data.phone,
      email: data.email,
      customerType: data.customerType as BulkOrderRequest["customerType"],
      product: data.product,
      quantityRequired: data.quantityRequired,
      unit: data.unit,
      location: data.location,
      preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
      frequency: (data.frequency as BulkOrderRequest["frequency"]) ?? "ONE_TIME",
      additionalInfo: data.additionalInfo,
    },
  });

  try {
    await sendEmail({
      to: SITE.email,
      subject: `New bulk enquiry from ${data.fullName}`,
      html: brandedEmail({
        title: "New bulk order enquiry",
        body: `<p><strong>Name:</strong> ${data.fullName}</p>
          <p><strong>Company:</strong> ${data.companyName ?? "-"}</p>
          <p><strong>Type:</strong> ${data.customerType}</p>
          <p><strong>Product:</strong> ${data.product ?? "-"}</p>
          <p><strong>Quantity:</strong> ${data.quantityRequired ?? "-"} ${data.unit ?? ""}</p>
          <p><strong>Location:</strong> ${data.location ?? "-"}</p>
          <p><strong>Frequency:</strong> ${data.frequency ?? "-"}</p>
          <p><strong>Contact:</strong> ${data.email} / ${data.phone}</p>
          <p>${data.additionalInfo ?? ""}</p>`,
      }),
    });
  } catch (e) {
    console.error("[bulk] admin notification failed", e);
  }

  return request;
}

export async function listBulkOrders() {
  return prisma.bulkOrderRequest.findMany({ orderBy: { createdAt: "desc" } });
}

export async function updateBulkStatus(id: string, status: string) {
  return prisma.bulkOrderRequest.update({
    where: { id },
    data: { status: status as BulkOrderRequest["status"] },
  });
}
