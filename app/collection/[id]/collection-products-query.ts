import type { QueryFunctionContext } from "@tanstack/react-query";
import { type CollectionProductsPage, fetchCollectionProducts } from "@/lib/collections";
import type { CollectionProductsQueryKey } from "./collection-queries";

export const COLLECTION_PRODUCTS_PAGE_SIZE = 24;

export const collectionProductsQueryFn = ({
  queryKey,
  pageParam = 0,
}: QueryFunctionContext<CollectionProductsQueryKey, number>) => {
  const [{ id }] = queryKey;
  return fetchCollectionProducts(id, COLLECTION_PRODUCTS_PAGE_SIZE, pageParam);
};

export const getCollectionProductsNextPageParam = (
  lastPage: CollectionProductsPage | undefined,
  allPages: CollectionProductsPage[],
) => {
  if (!lastPage) return undefined;

  const limit = lastPage.limit ?? COLLECTION_PRODUCTS_PAGE_SIZE;
  const lastPageCount = lastPage.products.length;

  if (lastPageCount < limit) {
    return undefined;
  }

  const totalFetched = allPages.reduce((acc, page) => acc + page.products.length, 0);

  if (typeof lastPage.total === "number" && totalFetched >= lastPage.total) {
    return undefined;
  }

  return totalFetched;
};
