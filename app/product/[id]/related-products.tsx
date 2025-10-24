"use client";

import { type QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { MasonryList } from "@/features/grid/masonry-list";
import { ProductCard } from "@/features/product/product-card";
import { fetchRelatedProducts } from "@/lib/products";
import { productQueries } from "./product-queries";

interface RelatedProductsProps {
  productId: string;
}

type RelatedListQueryKey = ReturnType<typeof productQueries.relatedList>;

const relatedProductsQueryFn = ({ queryKey, pageParam = 0 }: QueryFunctionContext<RelatedListQueryKey, number>) => {
  const [{ id }] = queryKey;
  return fetchRelatedProducts(id, 20, pageParam);
};

export function RelatedProducts({ productId }: RelatedProductsProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: productQueries.relatedList({ id: productId }),
    queryFn: relatedProductsQueryFn,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      const fetchedSoFar = allPages.reduce((acc, page) => acc + page.length, 0);
      return lastPage.length < 20 ? undefined : fetchedSoFar;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    if (isLoading || isFetchingNextPage || !hasNextPage) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchNextPage, hasNextPage, isLoading, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-neutral-grayPrimary">Loading related products...</div>
      </div>
    );
  }

  const allProducts = data?.pages.flat() ?? [];

  if (allProducts.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-neutral-graySecondary pt-12">
      <h2 className="subhead-large text-neutral-blackPrimary mb-8">Related Products</h2>
      <MasonryList
        items={allProducts.map((p) => ({ ...p, id: p.product_id }))}
        renderItem={(relatedProduct) => (
          <ProductCard
            productId={relatedProduct.product_id}
            imageUrl={relatedProduct.image_url}
            name={relatedProduct.name}
            price={relatedProduct.price}
            width={relatedProduct.width}
            height={relatedProduct.height}
          />
        )}
        onLoadMore={fetchNextPage}
        isLoadingMore={isFetchingNextPage}
      />
    </div>
  );
}
