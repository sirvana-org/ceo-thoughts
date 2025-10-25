import type { QueryFunctionContext } from "@tanstack/react-query";
import { fetchCollectionStores, type CollectionStoresPage } from "@/lib/collections";
import type { CollectionStoresQueryKey } from "./collection-queries";

export const COLLECTION_STORES_PAGE_SIZE = 20;

export const collectionStoresQueryFn = ({
  queryKey,
  pageParam = 0,
}: QueryFunctionContext<CollectionStoresQueryKey, number>) => {
  const [{ id }] = queryKey;
  return fetchCollectionStores(id, COLLECTION_STORES_PAGE_SIZE, pageParam);
};

export const getCollectionStoresNextPageParam = (
  lastPage: CollectionStoresPage | undefined,
  allPages: CollectionStoresPage[],
) => {
  if (!lastPage) return undefined;

  const limit = lastPage.limit ?? COLLECTION_STORES_PAGE_SIZE;
  const lastPageCount = lastPage.stores.length;

  if (lastPageCount < limit) {
    return undefined;
  }

  const totalFetched = allPages.reduce((acc, page) => acc + page.stores.length, 0);

  return totalFetched;
};
