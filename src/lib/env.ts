function required(name: string, value: string | undefined): string {
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    return "";
  }
  return value;
}

export const env = {
  databaseUrl: required("DATABASE_URL", process.env.DATABASE_URL),
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  authSecret: required("AUTH_SECRET", process.env.AUTH_SECRET),
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY ?? "",
  paystackPublicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "Eshcol Harvest Hub <hello@eshcolharvesthub.com>",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
};
