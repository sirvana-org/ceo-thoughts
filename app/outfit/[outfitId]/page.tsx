import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchOutfit } from "@/lib/outfits";

interface PageProps {
  params: {
    outfitId: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { outfitId } = await params;
  const outfit = await fetchOutfit(outfitId);

  if (!outfit) {
    return {
      title: "Outfit not found | Sirvana",
      description: "The requested outfit could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const username = outfit.user?.displayName || outfit.user?.username || "User";
  const title = outfit.caption
    ? `${outfit.caption.slice(0, 60)}${outfit.caption.length > 60 ? "..." : ""} - ${username}'s Outfit`
    : `${username}'s Outfit | Sirvana`;

  const description = outfit.caption
    ? `${outfit.caption.slice(0, 155)}${outfit.caption.length > 155 ? "..." : ""}`
    : `Check out this outfit by ${username}. ${outfit.likes} likes, ${outfit.comments} comments. Discover similar products and styles on Sirvana.`;

  const brands = outfit.images
    .flatMap((img) => img.brandTags?.map((tag) => tag.brandName) || [])
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(", ");

  const keywords = `outfit, fashion, style, ${username}, ${brands || "clothing"}, ${outfit.likes} likes, sirvana`;

  const previewImage = outfit.images[0]?.url;

  return {
    title,
    description,
    keywords,
    authors: [{ name: username }],
    creator: username,
    publisher: "Sirvana",
    metadataBase: new URL("https://melian.com"),
    openGraph: {
      title,
      description,
      type: "article",
      locale: "en_US",
      url: `https://melian.com/outfit/${outfit.id}`,
      siteName: "Sirvana",
      images: previewImage
        ? [
            {
              url: previewImage,
              width: 1200,
              height: 630,
              alt: `${username}'s outfit`,
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
      creator: `@${outfit.user?.username || "sirvana"}`,
      images: previewImage ? [previewImage] : ["/og-default.jpg"],
    },
    alternates: {
      canonical: `https://melian.com/outfit/${outfit.id}`,
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

export default async function OutfitPage({ params }: PageProps) {
  const { outfitId } = await params;
  const outfit = await fetchOutfit(outfitId);

  if (!outfit) {
    notFound();
  }

  const appStoreUrl = "https://apps.apple.com/us/app/melian/id6738385324";
  const products = outfit.similarProducts || [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    "@id": `https://melian.com/outfit/${outfit.id}`,
    headline: outfit.caption || `Outfit by ${outfit.user?.displayName || outfit.user?.username}`,
    text: outfit.caption || undefined,
    url: `https://melian.com/outfit/${outfit.id}`,
    datePublished: outfit.postedAt,
    author: outfit.user
      ? {
          "@type": "Person",
          name: outfit.user.displayName || outfit.user.username,
          image: outfit.user.avatar || undefined,
        }
      : undefined,
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: outfit.likes,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: outfit.comments,
      },
    ],
    image: outfit.images.map((img) => img.url),
  };

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />

      <div className="min-h-screen bg-white relative pb-24 lg:pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12">
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden">
                {outfit.images[0] && (
                  <Image
                    src={outfit.images[0].url}
                    alt={outfit.caption || "Outfit"}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>

              {outfit.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {outfit.images.slice(1).map((img, idx) => (
                    <div
                      key={img.url}
                      className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200"
                    >
                      <Image src={img.url} alt={`Outfit - ${idx + 2}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              {outfit.user && (
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    {outfit.user.avatar && (
                      <Image
                        src={outfit.user.avatar}
                        alt={outfit.user.displayName || outfit.user.username}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{outfit.user.displayName || outfit.user.username}</p>
                    {outfit.user.displayName && <p className="text-sm text-gray-500">@{outfit.user.username}</p>}
                  </div>
                </div>
              )}

              {outfit.caption && (
                <div>
                  <p className="text-gray-800 text-lg leading-relaxed">{outfit.caption}</p>
                </div>
              )}

              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" role="img" aria-label="Likes">
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">{outfit.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" role="img" aria-label="Comments">
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">{outfit.comments.toLocaleString()}</span>
                </div>
              </div>

              <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full bg-gray-900 text-white rounded-xl px-8 py-4 flex items-center justify-center gap-3 font-semibold hover:bg-gray-800 transition-colors"
              >
                <span>Get the App to Like & Comment</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <title>Arrow right</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>

          {products.length > 0 && (
            <div className="border-t border-gray-200 pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {products.map((product) => (
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
                    {product.price != null && (
                      <p className="text-sm text-gray-600">
                        ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
                      </p>
                    )}
                  </a>
                ))}
              </div>
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
              <Image src="/assets/logoSmall.png" alt="Melian Logo" width={40} height={40} className="rounded-full" />
              <div className="text-2xl font-semibold text-gray-900">Get the App</div>
            </div>

            <div className="text-sm text-gray-600 mb-3">Effortless shopping</div>

            <div>
              <Image src="/assets/appStoreBlack.svg" alt="Download on the App Store" width={120} height={40} />
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
              <title>Arrow right</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
