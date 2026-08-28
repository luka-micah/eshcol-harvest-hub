import { Router } from "express";
import { prisma } from "@/lib/db";
import { sendEmail, brandedEmail } from "@/lib/email/resend";
import { SITE } from "@/lib/constants";
import { ok, fail, parseBody } from "../lib/http";
import { contactSchema } from "@/lib/validation/schemas";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = await parseBody(req, contactSchema);
  if (!parsed.ok) return fail(res, parsed.error, parsed.status);
  const data = parsed.data;

  await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    },
  });

  try {
    await sendEmail({
      to: SITE.email,
      subject: `Contact form: ${data.subject}`,
      html: brandedEmail({
        title: "New contact message",
        body: `<p><strong>From:</strong> ${data.name} (${data.email}${data.phone ? ", " + data.phone : ""})</p><p>${data.message}</p>`,
      }),
    });
  } catch (e) {
    console.error("[contact] admin notification failed", e);
  }

  return ok(res, { success: true }, 201);
});

export default router;
