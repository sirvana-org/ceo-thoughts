import type { ProductPage } from "@/types/product";

export interface RelatedProduct {
  product_id: string;
  image_url?: string;
  name?: string;
  price?: number;
  price_currency?: string;
  width?: number;
  height?: number;
  store_id?: string;
  store_name?: string;
  store_url?: string;
  brand?: string;
  category?: string;
  description?: string;
  gender?: string;
  product_url?: string;
  stock?: boolean;
  vibe_search_queries?: string[];
}

export interface ProductWithRelatedResponse {
  product?: ProductPage;
  relatedProducts: RelatedProduct[];
}

/**
 * Fetch a product and its related products from the backend service.
 * Returns `null` when the product cannot be fetched.
 */
export async function fetchProduct(productId: string): Promise<ProductWithRelatedResponse | null> {
  if (!productId) return null;

  const url = `${process.env.NEXT_PUBLIC_API_URL}/products/${encodeURIComponent(productId)}?related=true&product=true&relatedLimit=20&relatedOffset=0`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      method: "GET",
      headers: {
        Authorization: "Bearer no-token-secret",
      },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as ProductWithRelatedResponse;
    return data;
  } catch {
    return null;
  }
}

export async function fetchRelatedProducts(productId: string, limit = 20, offset = 0): Promise<RelatedProduct[]> {
  if (!productId) return [];

  const url = `${process.env.NEXT_PUBLIC_API_URL}/products/related/${encodeURIComponent(productId)}?limit=${limit}&offset=${offset}`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      method: "GET",
      headers: {
        Authorization: "Bearer no-token-secret",
      },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as RelatedProduct[];
    return data;
  } catch {
    return [];
  }
}

export async function fetchStoreProducts(storeId: string, limit = 10): Promise<RelatedProduct[]> {
  if (!storeId) return [];

  const url = `${process.env.NEXT_PUBLIC_API_URL}/products/ready?size=${limit}&from=0&store_id=${storeId}`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      method: "GET",
      headers: {
        Authorization: "Bearer no-token-secret",
      },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}
