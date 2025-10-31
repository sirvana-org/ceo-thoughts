import type { QueryFunctionContext } from "@tanstack/react-query";
import { fetchStoreProducts, type StoreProductsResponse } from "@/lib/stores";
import type { StoreProductsQueryKey } from "./store-queries";

export const STORE_PRODUCTS_PAGE_SIZE = 24;

export const storeProductsQueryFn = async ({
  queryKey,
  pageParam = 0,
}: QueryFunctionContext<StoreProductsQueryKey, number>) => {
  const [{ id, category }] = queryKey;

  const productsData = await fetchStoreProducts(id, STORE_PRODUCTS_PAGE_SIZE, pageParam);

  if (!productsData) {
    return {
      data: [],
      total: 0,
      limit: STORE_PRODUCTS_PAGE_SIZE,
    };
  }

  let filteredProducts = productsData.data;

  if (category && productsData.filterFacets?.category) {
    filteredProducts = productsData.data;
  }

  return {
    data: filteredProducts,
    total: productsData.total ?? filteredProducts.length,
    limit: STORE_PRODUCTS_PAGE_SIZE,
    filterFacets: productsData.filterFacets,
  };
};

export const getStoreProductsNextPageParam = (
  lastPage: (StoreProductsResponse & { limit?: number }) | undefined,
  allPages: (StoreProductsResponse & { limit?: number })[],
) => {
  if (!lastPage) return undefined;

  const limit = lastPage.limit ?? STORE_PRODUCTS_PAGE_SIZE;
  const lastPageCount = lastPage.data.length;

  if (lastPageCount < limit) {
    return undefined;
  }

  const totalFetched = allPages.reduce((acc, page) => acc + page.data.length, 0);

  if (typeof lastPage.total === "number" && totalFetched >= lastPage.total) {
    return undefined;
  }

  return totalFetched;
};
