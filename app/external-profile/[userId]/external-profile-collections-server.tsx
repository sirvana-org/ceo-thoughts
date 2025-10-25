"use client";

import { CollectionCard } from "@/features/collection/collection-card";
import { MasonryList } from "@/features/grid/masonry-list";
import type { UserCollection } from "@/lib/collections";

interface ExternalProfileCollectionsServerProps {
  collections: UserCollection[];
}

export function ExternalProfileCollectionsServer({ collections }: ExternalProfileCollectionsServerProps) {
  if (collections.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="body-medium text-neutral-grayPrimary">No collections yet</p>
      </div>
    );
  }

  return (
    <MasonryList
      items={collections}
      renderItem={(collection, index) => (
        <CollectionCard
          collectionId={collection.id}
          ownerUserId={collection.user_id}
          name={collection.name}
          cover={collection.cover}
          previewImages={collection.previewImages}
          ownerUserName={collection.ownerUserName}
          ownerProfilePicture={collection.ownerProfilePicture}
          priority={index < 10}
        />
      )}
    />
  );
}
