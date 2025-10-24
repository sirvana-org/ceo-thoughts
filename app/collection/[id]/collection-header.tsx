"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchCollectionWithUser } from "@/lib/collections";
import { collectionQueries } from "./collection-queries";

interface CollectionHeaderProps {
  collectionId: string;
}

export function CollectionHeader({ collectionId }: CollectionHeaderProps) {
  const { data, isLoading } = useQuery({
    queryKey: collectionQueries.detail({ id: collectionId }),
    queryFn: () => fetchCollectionWithUser(collectionId),
  });

  const collection = data?.collection;
  const user = data?.user;

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 lg:py-20 animate-pulse">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="h-14 md:h-16 lg:h-20 bg-gray-200 rounded-lg mb-4" />
          <div className="h-6 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!collection) {
    return null;
  }

  return (
    <>
      {collection.cover ? (
        <div className="relative w-full h-[50vh] min-h-[400px] max-h-[600px]">
          <Image src={collection.cover} alt={collection.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80" />

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{collection.name}</h1>
              {collection.subtitle && (
                <p className="text-lg md:text-xl text-white/90 max-w-2xl">{collection.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">{collection.name}</h1>
            {collection.subtitle && (
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl">{collection.subtitle}</p>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {user?.userProfilePicture && (
            <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-200">
              <Image src={user.userProfilePicture} alt={user.userName || "User"} fill className="object-cover" />
            </div>
          )}

          <div className="flex-1">
            {user?.userName && <p className="text-lg font-medium text-gray-900 mb-2">{user.userName}</p>}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>{collection.productsCount || 0} products</span>
              {collection.storesCount > 0 && (
                <>
                  <span>•</span>
                  <span>{collection.storesCount} stores</span>
                </>
              )}
              {(collection.likesCount || 0) > 0 && (
                <>
                  <span>•</span>
                  <span>{collection.likesCount} likes</span>
                </>
              )}
              {(collection.commentsCount || 0) > 0 && (
                <>
                  <span>•</span>
                  <span>{collection.commentsCount} comments</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
