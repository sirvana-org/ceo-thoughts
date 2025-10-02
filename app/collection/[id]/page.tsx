import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchCollection, fetchCollectionWithUser, fetchCollectionProducts } from "@/lib/collections";

interface PageProps {
  params: {
    id: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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
  const description = collection.description || `Explore ${collection.name}. A curated collection featuring ${collection.storesCount || 0} stores and ${collection.productsCount || 0} products. ${collection.subtitle || "Discover amazing finds and recommendations."}`;
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
      images: collection.previewImages && collection.previewImages.length > 0 ? [
        {
          url: collection.previewImages[0],
          width: 1200,
          height: 630,
          alt: `${collection.name} collection preview`,
        },
      ] : [
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
      images: collection.previewImages && collection.previewImages.length > 0 ? [collection.previewImages[0]] : ["/og-default.jpg"],
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
      "rating": "general",
      "distribution": "global",
    },
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { id } = await params;
  const data = await fetchCollectionWithUser(id);
  const productsData = await fetchCollectionProducts(id, 24, 0);

  if (!data || !data.collection) {
    notFound();
  }

  const { collection, user } = data;
  const products = productsData?.products || [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Collection",
    "@id": `https://melian.com/collection/${collection.id}`,
    name: collection.name,
    description: collection.description || `A curated collection featuring ${collection.storesCount || 0} stores and ${collection.productsCount || 0} products`,
    url: `https://melian.com/collection/${collection.id}`,
    identifier: collection.id,
    numberOfItems: collection.productsCount || 0,
    dateCreated: collection.createdAt,
  };

  const appStoreUrl = "https://apps.apple.com/us/app/melian/id6738385324";
  const deeplink = `https://melian.com/collection/${collection.id}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-white relative">
        {collection.cover ? (
          <div className="relative w-full h-[50vh] min-h-[400px] max-h-[600px]">
            <Image
              src={collection.cover}
              alt={collection.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80" />

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  {collection.name}
                </h1>
                {collection.subtitle && (
                  <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                    {collection.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                {collection.name}
              </h1>
              {collection.subtitle && (
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
                  {collection.subtitle}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 md:mb-12">
            {user?.userProfilePicture && (
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-200">
                <Image
                  src={user.userProfilePicture}
                  alt={user.userName || "User"}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex-1">
              {user?.userName && (
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {user.userName}
                </p>
              )}
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

          {products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product: any) => (
                <a
                  key={product.product_id}
                  href={appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
                    {product.image_url && (
                      <Image
                        src={product.image_url}
                        alt={product.name || "Product"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  {product.name && (
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                  )}
                  {product.price && (
                    <p className="text-sm text-gray-600">
                      ${product.price.toFixed(2)}
                    </p>
                  )}
                </a>
              ))}
            </div>
          )}

          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products in this collection yet</p>
            </div>
          )}
        </div>

        <div className="fixed bottom-6 left-6 z-50 hidden lg:block">
          <a
            href={appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-6 block hover:bg-white transition-colors border border-gray-200"
          >
            <div className="flex items-center space-x-3 mb-2">
              <img
                src="/assets/logoSmall.png"
                alt="Melian Logo"
                className="w-10 h-10 rounded-full"
              />
              <div className="text-2xl font-semibold text-gray-900">Get the App</div>
            </div>

            <div className="text-sm text-gray-600 mb-3">Effortless shopping</div>

            <div>
              <img
                src="/assets/appStoreBlack.svg"
                alt="Download on the App Store"
                className="h-10 w-auto"
              />
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
