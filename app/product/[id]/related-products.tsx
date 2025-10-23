"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { fetchRelatedProducts, productQueries } from "./product-queries";

const appStoreUrl = "https://apps.apple.com/us/app/melian/id6738385324";

interface RelatedProduct {
  product_id: string;
  image_url?: string;
  name?: string;
  price?: number;
}

interface RelatedProductsProps {
  productId: string;
}

export function RelatedProducts({ productId }: RelatedProductsProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: productQueries.relatedList({ id: productId }),
    queryFn: fetchRelatedProducts,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;
      const currentTotal = allPages.reduce((sum, page) => sum + (page?.data.length || 0), 0);
      if (currentTotal < lastPage.total) {
        return currentTotal;
      }
      return undefined;
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

  const allProducts = data?.pages.flatMap((page) => page?.data || []) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-gray-400">Loading related products...</div>
      </div>
    );
  }

  if (allProducts.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 pt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {allProducts.map((relatedProduct: RelatedProduct) => (
          <a
            key={relatedProduct.product_id}
            href={appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
              {relatedProduct.image_url && (
                <Image
                  src={relatedProduct.image_url}
                  alt={relatedProduct.name || "Product"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>
            {relatedProduct.name && (
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{relatedProduct.name}</h3>
            )}
            {relatedProduct.price && (
              <p className="text-sm text-gray-600">
                ${typeof relatedProduct.price === "number" ? relatedProduct.price.toFixed(2) : relatedProduct.price}
              </p>
            )}
          </a>
        ))}
      </div>

      {hasNextPage && (
        <div ref={loadMoreRef} className="flex items-center justify-center py-8">
          {isFetchingNextPage && <div className="animate-pulse text-gray-400">Loading more...</div>}
        </div>
      )}
    </div>
  );
}
