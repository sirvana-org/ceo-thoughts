import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchCollection } from "@/lib/collections";

interface PageProps {
  params: {
    collectionId: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { collectionId } = await params;
  const collection = await fetchCollection(collectionId);

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
  const { collectionId } = await params;
  const collection = await fetchCollection(collectionId);

  if (!collection) {
    notFound();
  }

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

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <fuck you>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div>
        <h1>{collection.name}</h1>
        {collection.title && <h2>{collection.title}</h2>}
        {collection.subtitle && <p>{collection.subtitle}</p>}
        {collection.description && <p>{collection.description}</p>}
        <div>
          <span>{collection.storesCount || 0} stores</span>
          <span> � </span>
          <span>{collection.productsCount || 0} products</span>
        </div>
        {collection.isPrivate && <p>= Private collection</p>}
      </div>
    </>
  );
}