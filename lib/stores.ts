import type { StoreInfo } from "@/types/store";

export interface StoreProduct {
  product_id: string;
  image_url?: string;
  name?: string;
  price?: number;
  brand?: string;
  width?: number;
  height?: number;
}

export interface FilterFacetOption {
  key: string | number | boolean;
  count: number;
}

export type FilterFacets = Record<string, FilterFacetOption[]>;

export interface StoreProductsResponse {
  data: StoreProduct[];
  total?: number;
  from?: number;
  size?: number;
  filterFacets?: FilterFacets;
}

export interface StoreInfoResponse {
  store: StoreInfo;
  categories: string[];
}

export async function fetchStore(storeId: string): Promise<StoreInfoResponse | null> {
  if (!storeId) return null;

  const url = `${process.env.NEXT_PUBLIC_API_URL}/stores/ready/${encodeURIComponent(storeId)}`;
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
    return data as StoreInfoResponse;
  } catch {
    return null;
  }
}

export async function fetchStoreProducts(
  storeId: string,
  limit = 24,
  offset = 0,
): Promise<StoreProductsResponse | null> {
  if (!storeId) return null;

  const url = `${process.env.NEXT_PUBLIC_API_URL}/products/ready?size=${limit}&from=${offset}&store_id=${encodeURIComponent(storeId)}`;
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
    return data;
  } catch {
    return null;
  }
}
