// Paystack server-side integration.
// Money is handled in Naira (Decimal) in our DB; Paystack expects the minor
// unit (kobo) as an integer, so we convert before sending.

const PAYSTACK_BASE = "https://api.paystack.co";

interface InitArgs {
  email: string;
  amountNaira: number | string;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export async function initializeTransaction({
  email,
  amountNaira,
  reference,
  callbackUrl,
  metadata,
}: InitArgs) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  const amountKobo = Math.round(Number(amountNaira) * 100);
  if (!Number.isFinite(amountKobo) || amountKobo <= 0) {
    throw new Error("Invalid transaction amount");
  }

  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amountKobo,
      reference,
      callback_url: callbackUrl,
      metadata: metadata ?? {},
    }),
  });

  const json = (await res.json()) as PaystackResponse<{
    authorization_url: string;
    access_code: string;
    reference: string;
  }>;

  if (!res.ok || !json.status) {
    throw new Error(json.message || "Failed to initialize Paystack transaction");
  }
  return json.data;
}

export interface PaystackVerification {
  status: string; // "success" on successful payment
  reference: string;
  amount: number; // in kobo
  currency: string;
  paidAt: string | null;
  gatewayResponse: string;
  metadata: Record<string, unknown>;
}

export async function verifyTransaction(
  reference: string,
): Promise<PaystackVerification> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
    },
  );

  const json = (await res.json()) as PaystackResponse<PaystackVerification>;
  if (!res.ok || !json.status) {
    throw new Error(json.message || "Failed to verify Paystack transaction");
  }
  return json.data;
}
