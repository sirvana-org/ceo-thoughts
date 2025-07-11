import { ProductPage } from "@/types/product";

/**
 * Fetch a single product by its identifier from the backend service.
 * Uses Next.js fetch caching with a 60-second revalidation window.
 * Returns `null` when the product cannot be fetched.
 */
export async function fetchProduct(productId: string): Promise<ProductPage | null> {
  if (!productId) return null;


  const url = `https://backend-ts-cocg.onrender.com/products/${productId}?product=yes`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      method: "GET",
    });

    if (!res.ok) return null;

    const data = (await res.json()) as ProductPage;
    return data;
  } catch {
    return null;
  }

  return null;
} 