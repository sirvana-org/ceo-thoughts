import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getQueryClient } from "@/app/get-query-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchStore, fetchStoreProducts } from "@/lib/stores";
import { StoreProducts } from "./store-products";
import { storeProductsQueryFn } from "./store-products-query";
import { storeQueries } from "./store-queries";

interface PageProps {
  params: {
    storeId: string;
  };
}

export const revalidate = 60;

async function fetchStoreCategories(storeId: string) {
  const productsData = await fetchStoreProducts(storeId, 1, 0);

  if (!productsData?.filterFacets?.category) {
    return [];
  }

  return productsData.filterFacets.category.map((cat) => ({
    key: String(cat.key),
    name: String(cat.key),
    count: cat.count,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { storeId } = await params;
  const storeData = await fetchStore(storeId);

  if (!storeData) {
    return {
      title: "Store not found | Sirvana",
      description: "The requested store could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { store } = storeData;

  const title = store.page_title || `${store.name} - Shop Online`;
  const description =
    store.description ||
    `Shop at ${store.name}. ${store.verified ? "Verified store" : "Online store"} with ${store.categories ? `products in ${store.categories}` : "quality products"}. Discover amazing deals and products.`;
  const keywords = store.keywords || `${store.name}, online shopping, ${store.categories || "products"}, deals, shop`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: store.name }],
    creator: store.name,
    publisher: "Sirvana",
    metadataBase: new URL("https://melian.com"),
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      url: store.url || `https://melian.com/stores/${store.id}`,
      siteName: "Sirvana",
      images: store.logo
        ? [
            {
              url: store.logo,
              width: 1200,
              height: 630,
              alt: `${store.name} logo`,
            },
          ]
        : [
            {
              url: "/og-default.jpg",
              width: 1200,
              height: 630,
              alt: "Sirvana",
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@sirvana",
      creator: `@${store.name.toLowerCase().replace(/\s+/g, "")}`,
      images: store.logo ? [store.logo] : ["/og-default.jpg"],
    },
    alternates: {
      canonical: store.url || `https://melian.com/stores/${store.id}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "google-site-verification-code",
    },
    other: {
      "revisit-after": "7 days",
      rating: "general",
      distribution: "global",
    },
  };
}

export default async function StorePage({ params }: PageProps) {
  const { storeId } = await params;
  const storeData = await fetchStore(storeId);

  if (!storeData) {
    notFound();
  }

  const { store } = storeData;
  const categories = await fetchStoreCategories(storeId);

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: storeQueries.products({ id: storeId }),
    queryFn: storeProductsQueryFn,
    initialPageParam: 0,
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": store.url || `https://melian.com/stores/${store.id}`,
    name: store.name,
    description: store.description || `Shop at ${store.name}`,
    url: store.url || `https://melian.com/stores/${store.id}`,
    logo: store.logo || undefined,
    identifier: store.id,
    aggregateRating: store.verified
      ? {
          "@type": "AggregateRating",
          ratingValue: store.rank || 4.5,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  };

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="min-h-screen relative flex flex-col gap-6 lg:gap-8 pb-6 lg:pb-8">
        <div className="pt-6 md:pt-8 lg:pt-12">
          <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pb-6 md:pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {store.logo && (
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-white shadow-lg ring-1 ring-neutral-graySecondary">
                  <Image src={store.logo} alt={store.name} fill className="object-contain" priority />
                </div>
              )}

              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="headline-medium text-neutral-blackPrimary">{store.name}</h1>
                </div>

                {store.description && (
                  <p className="body-medium text-neutral-grayPrimary max-w-3xl">{store.description}</p>
                )}

                {store.categories && (
                  <div className="flex flex-wrap gap-2">
                    {store.categories.split(",").map((category) => (
                      <span
                        key={category.trim()}
                        className="px-3 py-1 bg-white border border-neutral-graySecondary rounded-full body-small text-neutral-grayPrimary"
                      >
                        {category.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="all">All Products</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category.key} value={category.key}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all">
                <StoreProducts storeId={storeId} />
              </TabsContent>

              {categories.map((category) => (
                <TabsContent key={category.key} value={category.key}>
                  <StoreProducts storeId={storeId} category={category.key} />
                </TabsContent>
              ))}
            </Tabs>
          </HydrationBoundary>
        </div>
      </div>
    </>
  );
}
