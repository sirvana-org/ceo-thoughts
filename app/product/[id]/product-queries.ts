import type { QueryFunctionContext } from "@tanstack/react-query";
import type { ProductPage } from "@/types/product";

export interface RelatedProduct {
  product_id: string;
  image_url?: string;
  name?: string;
  price?: number;
}

export const productQueries = {
  all: [{ scope: "products" }] as const,

  details: () => [{ ...productQueries.all[0], entity: "detail" }] as const,

  detail: ({ id }: { id: string }) => [{ ...productQueries.details()[0], id }] as const,

  relatedLists: () => [{ ...productQueries.all[0], entity: "related" }] as const,

  relatedList: ({ id }: { id: string }) => [{ ...productQueries.relatedLists()[0], id }] as const,
};

export const fetchProduct = async ({
  queryKey: [{ id }],
}: QueryFunctionContext<ReturnType<typeof productQueries.detail>>): Promise<ProductPage | null> => {
  if (!id) return null;

  const url = `${process.env.NEXT_PUBLIC_API_URL}/products/ready/${id}`;
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
};

export const fetchRelatedProducts = async ({
  queryKey: [{ id }],
  pageParam,
}: QueryFunctionContext<ReturnType<typeof productQueries.relatedList>, number>): Promise<{
  data: RelatedProduct[];
  total: number;
} | null> => {
  if (!id) return null;

  const limit = 20;
  const offset = pageParam;

  console.log(id, limit, offset);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/products/${encodeURIComponent(id)}?related=true&relatedLimit=${limit}&relatedOffset=${offset}`;
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
    return { data: data.relatedProducts || [], total: data.relatedProductsTotal || 0 };
  } catch {
    return null;
  }
};
