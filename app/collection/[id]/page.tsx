import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getQueryClient } from "@/app/get-query-client";
import { fetchCollection, fetchCollectionWithUser } from "@/lib/collections";
import { CollectionHeader } from "./collection-header";
import { CollectionProducts } from "./collection-products";
import { collectionQueries } from "./collection-queries";
import { collectionProductsQueryFn, getCollectionProductsNextPageParam } from "./collection-products-query";

interface PageProps {
  params: {
    id: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const collection = await fetchCollection(id);

  if (!collection) {
    return {
      title: "Collection not found | Sirvana",
      description: "The requested collection could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = collection.title || `${collection.name} - Curated Collection`;
  const description =
    collection.description ||
    `Explore ${collection.name}. A curated collection featuring ${collection.storesCount || 0} stores and ${collection.productsCount || 0} products. ${collection.subtitle || "Discover amazing finds and recommendations."}`;
  const keywords = `${collection.name}, curated collection, shopping collection, ${collection.storesCount || 0} stores, ${collection.productsCount || 0} products, recommendations`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Sirvana" }],
    creator: "Sirvana",
    publisher: "Sirvana",
    metadataBase: new URL("https://melian.com"),
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      url: `https://melian.com/collection/${collection.id}`,
      siteName: "Sirvana",
      images:
        collection.previewImages && collection.previewImages.length > 0
          ? [
              {
                url: collection.previewImages[0],
                width: 1200,
                height: 630,
                alt: `${collection.name} collection preview`,
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
      creator: "@sirvana",
      images:
        collection.previewImages && collection.previewImages.length > 0
          ? [collection.previewImages[0]]
          : ["/og-default.jpg"],
    },
    alternates: {
      canonical: `https://melian.com/collection/${collection.id}`,
    },
    robots: {
      index: !collection.isPrivate,
      follow: !collection.isPrivate,
      googleBot: {
        index: !collection.isPrivate,
        follow: !collection.isPrivate,
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

export default async function CollectionPage({ params }: PageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  const collectionData = await queryClient.fetchQuery({
    queryKey: collectionQueries.detail({ id }),
    queryFn: () => fetchCollectionWithUser(id),
  });

  if (!collectionData || !collectionData.collection) {
    notFound();
  }

  await queryClient.prefetchInfiniteQuery({
    queryKey: collectionQueries.products({ id }),
    queryFn: collectionProductsQueryFn,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => getCollectionProductsNextPageParam(lastPage, allPages),
  });

  const { collection } = collectionData;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Collection",
    "@id": `https://melian.com/collection/${collection.id}`,
    name: collection.name,
    description:
      collection.description ||
      `A curated collection featuring ${collection.storesCount || 0} stores and ${collection.productsCount || 0} products`,
    url: `https://melian.com/collection/${collection.id}`,
    identifier: collection.id,
    numberOfItems: collection.productsCount || 0,
    dateCreated: collection.createdAt,
  };

  const appStoreUrl = "https://apps.apple.com/us/app/melian/id6738385324";

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />

        <div className="min-h-screen bg-white relative">
          <CollectionHeader collectionId={collection.id} />

          <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
            <CollectionProducts collectionId={collection.id} />
          </div>

          <div className="fixed bottom-6 left-6 z-50 hidden lg:block">
            <a
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-6 block hover:bg-white transition-colors border border-gray-200"
            >
              <div className="flex items-center space-x-3 mb-2">
                <img src="/assets/logoSmall.png" alt="Melian Logo" width={40} height={40} className="rounded-full" />
                <div className="text-2xl font-semibold text-gray-900">Get the App</div>
              </div>

              <div className="text-sm text-gray-600 mb-3">Effortless shopping</div>

              <div>
                <img src="/assets/appStoreBlack.svg" alt="Download on the App Store" width={120} height={40} />
              </div>
            </a>
          </div>

          <div className="block lg:hidden bg-white border-t border-gray-200 p-4 fixed bottom-0 left-0 right-0 z-50">
            <a
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 text-white rounded-xl px-6 py-4 flex items-center justify-center gap-3 w-full font-semibold hover:bg-gray-800 transition-colors"
            >
              <span>Download App</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img" aria-label="Arrow right">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </>
    </HydrationBoundary>
  );
}
