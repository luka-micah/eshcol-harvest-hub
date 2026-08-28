import { serverApiFetch } from "@/lib/server-api";
import { AdminProducts } from "@/components/admin/AdminProducts";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const res = await serverApiFetch("/api/v1/products?all=1");
  const data = await res.json();
  const products: any[] = data.products ?? [];
  const categoriesRes = await serverApiFetch("/api/v1/categories");
  const categories: any[] = (await categoriesRes.json()).categories ?? [];

  return (
    <AdminProducts
      products={products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        unit: p.unit,
        status: p.status,
        published: p.published,
        availableQty: p.availableQty,
      }))}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}

