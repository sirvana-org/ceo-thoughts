"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Spinner } from "@/features/grid/masonry-list";
import { StoreItem } from "@/features/stores/store-item";
import type { CollectionStoresQueryKey } from "./collection-queries";
import { collectionQueries } from "./collection-queries";
import { collectionStoresQueryFn, getCollectionStoresNextPageParam } from "./collection-stores-query";

interface CollectionStoresProps {
  collectionId: string;
}

export function CollectionStores({ collectionId }: CollectionStoresProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: collectionQueries.stores({ id: collectionId }) as CollectionStoresQueryKey,
    queryFn: collectionStoresQueryFn,
    getNextPageParam: (lastPage, allPages) => getCollectionStoresNextPageParam(lastPage, allPages),
    initialPageParam: 0,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const allStores = data?.pages.flatMap((page) => page.stores) ?? [];

  if (allStores.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No brands in this collection yet</p>
      </div>
    );
  }

  return (
    <section>
      <div className="space-y-5">
        {allStores.map((store) => (
          <StoreItem key={store.id} store={store} />
        ))}
      </div>
      {hasNextPage && (
        <div className="flex justify-center pt-8">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
