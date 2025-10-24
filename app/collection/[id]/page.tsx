import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { getQueryClient } from "@/app/get-query-client";
import { fetchCollection, fetchCollectionWithUser } from "@/lib/collections";
import { CollectionHeader } from "./collection-header";
import { CollectionProducts } from "./collection-products";
import { collectionProductsQueryFn, getCollectionProductsNextPageParam } from "./collection-products-query";
import { collectionQueries } from "./collection-queries";

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
    getNextPageParam: (
      lastPage: Awaited<ReturnType<typeof collectionProductsQueryFn>>,
      allPages: Awaited<ReturnType<typeof collectionProductsQueryFn>>[],
    ) => getCollectionProductsNextPageParam(lastPage, allPages),
  });

  const { collection } = collectionData;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Collection",
    "@id": `https://melian.com/collection/${collection.id}`,
    name: collection.name,
    description:
      collection.subtitle ||
      `A curated collection featuring ${collection.storesCount || 0} stores and ${collection.productsCount || 0} products`,
    url: `https://melian.com/collection/${collection.id}`,
    identifier: collection.id,
    numberOfItems: collection.productsCount || 0,
    dateCreated: collection.createdAt,
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Script id={`collection-${collection.id}-jsonld`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData).replace(/</g, "\\u003c")}
      </Script>

      <div className="flex flex-col gap-8 md:gap-12 justify-start p-4 md:p-8 max-w-7xl mx-auto">
        <CollectionHeader collectionId={collection.id} />
        <CollectionProducts collectionId={collection.id} />
      </div>
    </HydrationBoundary>
  );
}
