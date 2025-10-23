import type { ProductPage } from "@/types/product";

interface RelatedProduct {
  product_id: string;
  image_url?: string;
  name?: string;
  price?: number;
}

/**
 * Fetch a single product by its identifier from the backend service.
 * Uses Next.js fetch caching with a 60-second revalidation window.
 * Returns `null` when the product cannot be fetched.
 */
export async function fetchProduct(productId: string): Promise<ProductPage | null> {
  if (!productId) return null;

  const url = `${process.env.NEXT_PUBLIC_API_URL}/products/ready/${productId}`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      method: "GET",
      headers: {
        Authorization: "Bearer no-token-secret",
      },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as ProductPage;
    return data;
  } catch {
    return null;
  }
}

export async function fetchRelatedProducts(
  productId: string,
  limit = 20,
  offset = 0,
): Promise<{ data: RelatedProduct[]; total: number } | null> {
  if (!productId) return null;

  const url = `${process.env.NEXT_PUBLIC_API_URL}/products/ready/related/${productId}?limit=${limit}&offset=${offset}`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      method: "GET",
      headers: {
        Authorization: "Bearer no-token-secret",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return { data: data.data || [], total: data.total || 0 };
  } catch {
    return null;
  }
}
