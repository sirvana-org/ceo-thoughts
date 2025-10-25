"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { UserProfileBadge } from "@/components/user-profile-badge";
import { type CollectionWithUser, fetchCollectionWithUser } from "@/lib/collections";
import { collectionQueries } from "./collection-queries";

const CollectionUserInfo = ({ collection }: { collection: CollectionWithUser }) => {
  return (
    <div className="flex flex-row items-center gap-2 md:gap-3">
      {collection.user?.userProfilePicture && (
        <div className="relative w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden">
          <Image
            src={collection.user.userProfilePicture}
            alt={collection.user.userName || "User"}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="flex-1 pt-1">
        {collection.user?.userName && (
          <p className="body-medium text-neutral-blackPrimary mb-1">{collection.user.userName}</p>
        )}
      </div>
    </div>
  );
};

const CollectionHeaderContent = ({ collection }: { collection: CollectionWithUser }) => {
  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <div className="md:hidden">
        <UserProfileBadge
          size="md"
          userId={collection.user?.userId || ""}
          userName={collection.user?.userName}
          profilePicture={collection.user?.userProfilePicture}
        />
      </div>

      <div className="flex flex-col gap-2 md:gap-4">
        <h1 className="headline-small md:headline-medium text-neutral-blackPrimary">{collection.collection.name}</h1>
        {collection.collection.subtitle && (
          <p className="body-medium md:subhead-medium text-neutral-blackPrimary">{collection.collection.subtitle}</p>
        )}
      </div>

      {/* Desktop: User info below */}
      <div className="hidden md:block">
        <UserProfileBadge
          size="md"
          userId={collection.user?.userId || ""}
          userName={collection.user?.userName}
          profilePicture={collection.user?.userProfilePicture}
        />
      </div>
    </div>
  );
};
interface CollectionHeaderProps {
  collectionId: string;
}

export function CollectionHeader({ collectionId }: CollectionHeaderProps) {
  const { data, isLoading } = useQuery({
    queryKey: collectionQueries.detail({ id: collectionId }),
    queryFn: () => fetchCollectionWithUser(collectionId),
  });

  const collection = data?.collection;

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 lg:py-20 animate-pulse">
        <div>
          <div className="h-14 md:h-16 lg:h-20 bg-gray-200 rounded-lg mb-4" />
          <div className="h-6 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!collection) {
    return null;
  }

  return collection.cover ? (
    <div className="flex flex-col md:flex-row gap-8 md:gap-6">
      <div className="relative w-full md:w-[300px] h-[300px]">
        <Image
          src={collection.cover}
          alt={collection.name}
          fill
          className="object-cover rounded-[30px] md:rounded-[14px]"
          priority
        />
      </div>
      <CollectionHeaderContent collection={data} />
    </div>
  ) : (
    <CollectionHeaderContent collection={data} />
  );
}
