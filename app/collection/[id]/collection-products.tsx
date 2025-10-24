"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { MasonryList, Spinner } from "@/features/grid/masonry-list";
import { ProductCard } from "@/features/product/product-card";
import { collectionQueries } from "./collection-queries";
import { CollectionProductsQueryKey, collectionProductsQueryFn, getCollectionProductsNextPageParam } from "./collection-products-query";

interface CollectionProductsProps {
  collectionId: string;
}

export function CollectionProducts({ collectionId }: CollectionProductsProps) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: collectionQueries.products({ id: collectionId }) as CollectionProductsQueryKey,
    queryFn: collectionProductsQueryFn,
    getNextPageParam: (lastPage, allPages) => getCollectionProductsNextPageParam(lastPage, allPages),
    initialPageParam: 0,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const allProducts =
    data?.pages.flatMap((page) => page.products.map((product) => ({ ...product, id: product.product_id }))) ?? [];

  if (allProducts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No products in this collection yet</p>
      </div>
    );
  }

  return (
    <MasonryList
      items={allProducts}
      renderItem={(product) => (
        <ProductCard
          productId={product.product_id}
          imageUrl={product.image_url}
          name={product.name}
          price={product.price}
          brand={product.brand}
          width={product.width}
          height={product.height}
        />
      )}
      onLoadMore={hasNextPage ? fetchNextPage : undefined}
      isLoadingMore={isFetchingNextPage}
      className="pb-12"
    />
  );
}
