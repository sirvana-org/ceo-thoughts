"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Spinner } from "@/features/grid/masonry-list";
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
          <Link key={store.id} href={`/stores/${store.id}`} className="flex items-center gap-3">
            {store.logo ? (
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                <Image src={store.logo} alt={store.name} fill className="object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="body-small text-neutral-blackPrimary truncate">{store.name}</p>
            </div>
          </Link>
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
