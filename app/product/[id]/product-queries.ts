import type { QueryFunctionContext } from "@tanstack/react-query";
import type { ProductPage } from "@/types/product";

export interface RelatedProduct {
  product_id: string;
  image_url?: string;
  name?: string;
  price?: number;
  width?: number;
  height?: number;
  store_id?: string;
  store_name?: string;
  store_url?: string;
}

interface ProductWithRelatedResponse {
  product?: ProductPage;
  relatedProducts: RelatedProduct[];
}

export const productQueries = {
  all: [{ scope: "products" }] as const,

  details: () => [{ ...productQueries.all[0], entity: "detail" }] as const,

  detail: ({ id }: { id: string }) => [{ ...productQueries.details()[0], id }] as const,

  relatedLists: () => [{ ...productQueries.all[0], entity: "related" }] as const,

  relatedList: ({ id }: { id: string }) => [{ ...productQueries.relatedLists()[0], id }] as const,

  storeProducts: (storeId: string) => [{ ...productQueries.all[0], entity: "storeProducts", storeId }] as const,
};

export const fetchProduct = async ({
  queryKey: [{ id }],
}: QueryFunctionContext<ReturnType<typeof productQueries.detail>>): Promise<ProductWithRelatedResponse | null> => {
  if (!id) return null;

  const url = `${process.env.NEXT_PUBLIC_API_URL}/products/${encodeURIComponent(id)}?related=true&product=true&relatedLimit=20&relatedOffset=0`;
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
};

export const fetchRelatedProducts = async ({
  queryKey: [{ id }],
  pageParam,
}: QueryFunctionContext<ReturnType<typeof productQueries.relatedList>, number>): Promise<RelatedProduct[]> => {
  if (!id) return [];

  const limit = 20;
  const offset = pageParam;

  const url = `${process.env.NEXT_PUBLIC_API_URL}/products/related/${encodeURIComponent(id)}?limit=${limit}&offset=${offset}`;
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
};

export const fetchStoreProducts = async ({
  queryKey: [{ storeId }],
}: QueryFunctionContext<ReturnType<typeof productQueries.storeProducts>>): Promise<RelatedProduct[]> => {
  if (!storeId) return [];

  const limit = 10;
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

    const response = await res.json();
    return response.data || [];
  } catch {
    return [];
  }
};
