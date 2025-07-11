import { ProductPage } from "@/types/product";

/**
 * Fetch a single product by its identifier from the backend service.
 * Uses Next.js fetch caching with a 60-second revalidation window.
 * Returns `null` when the product cannot be fetched.
 */
export async function fetchProduct(productId: string): Promise<ProductPage | null> {
  if (!productId) return null;


  try {
    const res = await fetch(`https://backend-ts-cocg.onrender.com/products/${productId}`, {
      // Revalidate at most once per minute
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as { product?: ProductPage };
    if (data?.product) {
      return data.product;
    }
  } catch {
    return null;
  }

  return null;
} 