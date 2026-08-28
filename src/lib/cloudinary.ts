// Cloudinary helper for the admin media pipeline (PRD §33).
// When credentials are missing we fall back to returning the raw URL unchanged
// so the UI still works in local development.

import { v2 as cloudinary } from "cloudinary";

let configured = false;
function configure() {
  if (configured) return;
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    configured = true;
  }
}

export async function uploadImage(
  file: Buffer | string,
  folder = "eshcol-harvest-hub/products",
): Promise<string> {
  configure();
  if (!configured) {
    // Local fallback: return the original data/url unchanged.
    return typeof file === "string" ? file : "data:image;base64";
  }
  const result = await cloudinary.uploader.upload(
    typeof file === "string" ? file : `data:image/png;base64,${file.toString("base64")}`,
    { folder, resource_type: "auto" },
  );
  return result.secure_url;
}

export function cloudinaryUrl(
  publicId: string,
  transforms: string = "f_auto,q_auto,w_1200",
): string {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloud) return publicId;
  return `https://res.cloudinary.com/${cloud}/image/upload/${transforms}/${publicId}`;
}
