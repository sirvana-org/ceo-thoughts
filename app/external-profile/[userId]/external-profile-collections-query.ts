import type { QueryFunctionContext } from "@tanstack/react-query";
import { fetchUserCollections, type UserCollectionsPage } from "@/lib/collections";
import type { UserCollectionsQueryKey } from "./external-profile-collections-queries";

export const USER_COLLECTIONS_PAGE_SIZE = 21;

export const userCollectionsQueryFn = ({
  queryKey,
  pageParam = 0,
}: QueryFunctionContext<UserCollectionsQueryKey, number>) => {
  const [{ userId }] = queryKey;
  return fetchUserCollections(userId, USER_COLLECTIONS_PAGE_SIZE, pageParam);
};

export const getUserCollectionsNextPageParam = (
  lastPage: UserCollectionsPage | undefined,
  allPages: UserCollectionsPage[],
) => {
  if (!lastPage) return undefined;

  const limit = lastPage.limit ?? USER_COLLECTIONS_PAGE_SIZE;
  const lastPageCount = lastPage.collections.length;

  if (lastPageCount < limit) {
    return undefined;
  }

  const totalFetched = allPages.reduce((acc, page) => acc + page.collections.length, 0);

  return totalFetched;
};
