import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Script from "next/script";
import { fetchUserCollections } from "@/lib/collections";
import { fetchExternalProfile } from "@/lib/users";
import { ExternalProfileCollectionsServer } from "./external-profile-collections-server";
import { buildExternalProfileStructuredData } from "./external-profile-structured-data";

interface PageProps {
  params: {
    userId: string;
  };
}

export const revalidate = 60;

const MELIAN_SITE_URL = "https://melian.com";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params;
  const profile = await fetchExternalProfile(userId);

  if (!profile) {
    return {
      title: "Profile not found | Sirvana",
      description: "The requested profile could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const displayName = profile.name ?? "Melian user";
  const handle = profile.userName ?? "Melian user";
  const description = `${displayName} on Melian. Follow along and save the finds.`;
  const canonical = `${MELIAN_SITE_URL}/external-profile/${profile.userId ?? profile.id}`;

  return {
    title: `Follow ${displayName} on Melian | Sirvana`,
    description,
    keywords: `${displayName}, Melian, fashion wishlist, wardrobe moodboard${handle ? `, ${handle}` : ""}`,
    metadataBase: new URL(MELIAN_SITE_URL),
    openGraph: {
      title: `Follow ${displayName} on Melian`,
      description,
      type: "website",
      locale: "en_US",
      url: canonical,
      siteName: "Sirvana",
      images: profile.picture
        ? [
            {
              url: profile.picture,
              width: 1200,
              height: 630,
              alt: `${displayName} on Melian`,
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
      title: `Follow ${displayName} on Melian`,
      description,
      site: "@sirvana",
      creator: handle ? `@${handle}` : "@sirvana",
      images: profile.picture ? [profile.picture] : ["/og-default.jpg"],
    },
    alternates: {
      canonical,
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
  };
}

const getInitials = ({ name }: { name: string | null }) => {
  if (!name) {
    return "M";
  }

  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() ?? "M";
  }

  const first = parts[0]?.[0];
  const last = parts[parts.length - 1]?.[0];
  return `${first ?? ""}${last ?? ""}`.toUpperCase() || "M";
};

export default async function ExternalProfilePage({ params }: PageProps) {
  const { userId } = await params;

  const profile = await fetchExternalProfile(userId);

  if (!profile) {
    notFound();
  }

  const collectionsData = await fetchUserCollections(userId, 50, 0);

  const { profileId, sanitizedJsonLd } = buildExternalProfileStructuredData(profile, userId, MELIAN_SITE_URL);

  return (
    <>
      <Script id={`external-profile-${profileId}-jsonld`} type="application/ld+json" strategy="beforeInteractive">
        {sanitizedJsonLd}
      </Script>

      <div className="min-h-screen flex flex-col items-center p-4 pt-6 md:p-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 mb-8 md:mb-12">
          {/* Avatar */}
          {profile.picture ? (
            <div className="relative w-[88px] h-[88px] rounded-full overflow-hidden">
              <Image
                src={profile.picture}
                alt={profile.name ? `${profile.name}'s avatar` : "Melian profile avatar"}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="w-[88px] h-[88px] rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-4xl font-semibold text-gray-600">{getInitials({ name: profile.name })}</span>
            </div>
          )}

          {/* Name and description */}
          <div className="flex flex-col items-center gap-1">
            <h1 className="headline-small text-neutral-blackPrimary">{profile.name}</h1>
            {profile.description && <p className="body-medium text-neutral-blackPrimary">{profile.description}</p>}
          </div>
        </div>

        {/* Collections */}
        <div className="w-full max-w-7xl">
          <section className="w-full">
            <ExternalProfileCollectionsServer collections={collectionsData.collections} />
          </section>
        </div>
      </div>
    </>
  );
}
