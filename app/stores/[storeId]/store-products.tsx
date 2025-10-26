"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { MasonryList, Spinner } from "@/features/grid/masonry-list";
import { ProductCard } from "@/features/product/product-card";
import { storeProductsQueryFn, getStoreProductsNextPageParam } from "./store-products-query";
import type { StoreProductsQueryKey } from "./store-queries";
import { storeQueries } from "./store-queries";

interface StoreProductsProps {
  storeId: string;
  category?: string;
}

export function StoreProducts({ storeId, category }: StoreProductsProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: storeQueries.products({ id: storeId, category }) as StoreProductsQueryKey,
    queryFn: storeProductsQueryFn,
    getNextPageParam: (lastPage, allPages) => getStoreProductsNextPageParam(lastPage, allPages),
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
    data?.pages.flatMap((page) => page.data.map((product) => ({ ...product, id: product.product_id }))) ?? [];

  if (allProducts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No products available yet</p>
      </div>
    );
  }

  return (
    <section>
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
    </section>
  );
}
