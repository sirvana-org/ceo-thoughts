import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/get-query-client";
import { AppStoreButtons } from "./app-store-buttons";
import { ProductImageGallery } from "./product-image-gallery";
import { ProductInfo } from "./product-info";
import { fetchProduct, fetchRelatedProducts, productQueries } from "./product-queries";
import { RelatedProducts } from "./related-products";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: productQueries.detail({ id }),
      queryFn: fetchProduct,
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: productQueries.relatedList({ id }),
      queryFn: fetchRelatedProducts,
      initialPageParam: 0,
      getNextPageParam: (lastPage: Awaited<ReturnType<typeof fetchRelatedProducts>>) => {
        if (!lastPage) return undefined;
        if (lastPage.data.length < lastPage.total) {
          return lastPage.data.length;
        }
        return undefined;
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-white relative pb-24 lg:pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12">
            <ProductImageGallery productId={id} />
            <ProductInfo productId={id} />
          </div>

          <RelatedProducts productId={id} />
        </div>

        <AppStoreButtons />
      </div>
    </HydrationBoundary>
  );
}
