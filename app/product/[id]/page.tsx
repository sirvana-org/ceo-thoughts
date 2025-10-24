import { dehydrate, HydrationBoundary, type QueryFunctionContext } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { getQueryClient } from "@/app/get-query-client";
import { Button } from "@/components/ui/button";
import { fetchProduct, fetchRelatedProducts, fetchStoreProducts } from "@/lib/products";
import { ProductImageGallery } from "./product-image-gallery";
import { ProductInfo } from "./product-info";
import { productQueries } from "./product-queries";
import { RelatedProducts } from "./related-products";

const MobileBuyButton = () => {
  return (
    <div className="block lg:hidden bg-white border-t border-gray-200 p-4 fixed bottom-0 left-0 right-0 z-50">
      <Button asChild variant="primary" size="lg" className="w-full">
        <a href="https://apps.apple.com/us/app/melian/id6738385324" target="_blank" rel="noopener noreferrer">
          <span>Download App</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Arrow right">
            <title>Arrow right</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </Button>
    </div>
  );
};

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = getQueryClient();

  const productData = await queryClient.fetchQuery({
    queryKey: productQueries.detail({ id }),
    queryFn: () => fetchProduct(id),
  });

  if (!productData?.product) {
    notFound();
  }

  const storeId = productData.product?.storeId;

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: productQueries.relatedList({ id }),
      queryFn: ({ pageParam = 0 }: QueryFunctionContext<ReturnType<typeof productQueries.relatedList>, number>) =>
        fetchRelatedProducts(id, 20, pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage: Awaited<ReturnType<typeof fetchRelatedProducts>>) => {
        if (!lastPage || lastPage.length === 0) return undefined;
        return lastPage.length < 20 ? undefined : 20;
      },
    }),
    storeId
      ? queryClient.prefetchQuery({
          queryKey: productQueries.storeProducts(storeId),
          queryFn: () => fetchStoreProducts(storeId),
        })
      : Promise.resolve(),
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

        <MobileBuyButton />
      </div>
    </HydrationBoundary>
  );
}
