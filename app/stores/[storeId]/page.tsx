import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchStore } from "@/lib/stores";

interface PageProps {
  params: {
    storeId: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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
  const description = store.description || `Shop at ${store.name}. ${store.verified ? "Verified store" : "Online store"} with ${store.categories ? `products in ${store.categories}` : "quality products"}. Discover amazing deals and products.`;
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
      url: store.url || `https://melian.com/store/${store.id}`,
      siteName: "Sirvana",
      images: store.logo ? [
        {
          url: store.logo,
          width: 1200,
          height: 630,
          alt: `${store.name} logo`,
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
      creator: `@${store.name.toLowerCase().replace(/\s+/g, "")}`,
      images: store.logo ? [store.logo] : ["/og-default.jpg"],
    },
    alternates: {
      canonical: store.url || `https://melian.com/store/${store.id}`,
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
      "rating": "general",
      "distribution": "global",
    },
  };
}

export default async function StorePage({ params }: PageProps) {
  const { storeId } = await params;
  const store = await fetchStore(storeId);

  if (!store) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": store.url || `https://melian.com/store/${store.id}`,
    name: store.name,
    description: store.description || `Shop at ${store.name}`,
    url: store.url || `https://melian.com/store/${store.id}`,
    logo: store.logo || undefined,
    identifier: store.id,
    aggregateRating: store.verified ? {
      "@type": "AggregateRating",
      ratingValue: store.rank || 4.5,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div>
        <h1>{store.name}</h1>
        {store.verified && <span>✓ Verified Store</span>}
        {store.description && <p>{store.description}</p>}
        {store.categories && <p>Categories: {store.categories}</p>}
      </div>
    </>
  );
}