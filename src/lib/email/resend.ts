// Transactional email via Resend.
// When RESEND_API_KEY is absent (local dev / tests) we log instead of failing,
// so the rest of the order flow still works.

import { Resend } from "resend";

interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Eshcol Harvest Hub <hello@eshcolharvesthub.com>";

  if (!apiKey) {
    console.info("[email:stub] Would send email", {
      from,
      to,
      subject,
    });
    return { stub: true };
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
  });

  if (error) {
    console.error("[email] send failed", error);
    throw new Error(error.message || "Failed to send email");
  }
  return data;
}

/** Shared branded wrapper so every email looks consistent. */
export function brandedEmail(content: { title: string; body: string }): string {
  return `
  <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1f2a1f">
    <div style="background:#2f6b3a;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0">
      <h1 style="margin:0;font-size:18px">Eshcol Harvest Hub</h1>
    </div>
    <div style="border:1px solid #e3e8e3;border-top:0;padding:24px;border-radius:0 0 8px 8px">
      <h2 style="margin-top:0">${content.title}</h2>
      <div style="line-height:1.6">${content.body}</div>
      <hr style="border:none;border-top:1px solid #e3e8e3;margin:20px 0" />
      <p style="font-size:12px;color:#6b7a6b">Fresh From Our Farm. Grown With Care. — Jos, Plateau State, Nigeria</p>
    </div>
  </div>`;
}
