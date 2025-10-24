"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { MasonryList, Spinner } from "@/features/grid/masonry-list";
import { CollectionCard } from "@/features/collection/collection-card";
import { userCollectionsQueryFn, getUserCollectionsNextPageParam } from "./external-profile-collections-query";
import type { UserCollectionsQueryKey } from "./external-profile-collections-queries";
import { userCollectionsQueries } from "./external-profile-collections-queries";

interface ExternalProfileCollectionsProps {
  userId: string;
}

export function ExternalProfileCollections({ userId }: ExternalProfileCollectionsProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: userCollectionsQueries.list({ userId }) as UserCollectionsQueryKey,
    queryFn: userCollectionsQueryFn,
    getNextPageParam: (lastPage, allPages) => getUserCollectionsNextPageParam(lastPage, allPages),
    initialPageParam: 0,
  });

  const allCollections = data?.pages.flatMap((page) => page.collections) ?? [];

  if (allCollections.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="body-medium text-neutral-grayPrimary">No collections yet</p>
      </div>
    );
  }

  return (
    <section className="w-full">
      <MasonryList
        items={allCollections}
        renderItem={(collection, index) => (
          <CollectionCard
            collectionId={collection.id}
            name={collection.name}
            cover={collection.cover}
            previewImages={collection.previewImages}
            ownerUserName={collection.ownerUserName}
            ownerProfilePicture={collection.ownerProfilePicture}
            priority={index < 10}
          />
        )}
        onLoadMore={hasNextPage ? fetchNextPage : undefined}
        isLoadingMore={isFetchingNextPage}
      />
    </section>
  );
}
