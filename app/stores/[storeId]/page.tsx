import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchStore, fetchStoreProducts } from "@/lib/stores";

interface PageProps {
  params: {
    storeId: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { storeId } = await params;
  const store = await fetchStore(storeId);

  if (!store) {
    return {
      title: "Store not found | Sirvana",
      description: "The requested store could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

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
  const store = await fetchStore(storeId);
  const productsData = await fetchStoreProducts(storeId, 24, 0);

  if (!store) {
    notFound();
  }

  const products = productsData?.data || [];
  const appStoreUrl = "https://apps.apple.com/us/app/melian/id6738385324";

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="min-h-screen bg-white relative pb-24 lg:pb-8">
        <div className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 lg:py-20 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
              {store.logo && (
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-white shadow-lg ring-1 ring-gray-200">
                  <Image src={store.logo} alt={store.name} fill className="object-cover" priority />
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">{store.name}</h1>
                  {store.verified && (
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {store.description && <p className="text-lg text-gray-600 max-w-3xl mb-4">{store.description}</p>}

                {store.categories && (
                  <div className="flex flex-wrap gap-2">
                    {store.categories.split(",").map((category, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
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

        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
          {products.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Products</h2>
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
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
                    )}
                    {product.price && (
                      <p className="text-sm text-gray-600">
                        ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No products available yet</p>
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
              <img src="/assets/logoSmall.png" alt="Melian Logo" className="w-10 h-10 rounded-full" />
              <div className="text-2xl font-semibold text-gray-900">Get the App</div>
            </div>

            <div className="text-sm text-gray-600 mb-3">Effortless shopping</div>

            <div>
              <img src="/assets/appStoreBlack.svg" alt="Download on the App Store" className="h-10 w-auto" />
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
