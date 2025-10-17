import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchExternalProfile } from "@/lib/users";
import type { ExternalProfile } from "@/types/user";

interface PageProps {
  params: {
    userId: string;
  };
}

export const revalidate = 60;

const APP_STORE_URL = "https://apps.apple.com/us/app/melian/id6738385324";
const MELIAN_SITE_URL = "https://melian.com";

const formatCount = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "—";
  }

  if (value >= 1000) {
    const formatted = value / 1000;
    const rounded = Number.isInteger(formatted) ? formatted.toFixed(0) : formatted.toFixed(1);
    return `${rounded}k`;
  }

  return value.toString();
};

const getDisplayName = (profile: ExternalProfile | null) => {
  if (!profile) return undefined;
  return profile.name?.trim() || profile.userName || profile.username || undefined;
};

const getHandle = (profile: ExternalProfile | null) => {
  if (!profile) return undefined;
  return profile.userName || profile.username || undefined;
};

const getInitials = (profile: ExternalProfile | null) => {
  const displayName = getDisplayName(profile);
  if (!displayName) {
    return "M";
  }

  const parts = displayName.split(" ").filter(Boolean);
  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() ?? "M";
  }

  const first = parts[0]?.[0];
  const last = parts[parts.length - 1]?.[0];
  return `${first ?? ""}${last ?? ""}`.toUpperCase() || "M";
};

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

  const displayName = getDisplayName(profile) ?? "Melian user";
  const handle = getHandle(profile);
  const description = `${displayName} keeps a running wishlist on Melian—real pieces, shoppable drops, zero fluff. Open the app to follow along and save the finds before they sell out.`;
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

export default async function ExternalProfilePage({ params }: PageProps) {
  const { userId } = await params;
  const profile = await fetchExternalProfile(userId);

  if (!profile) {
    notFound();
  }

  const displayName = getDisplayName(profile);
  const handle = getHandle(profile);
  const firstName = displayName?.split(" ")[0];
  const heroTitle = displayName ? `Follow ${displayName} on Melian` : "This profile lives on Melian";
  const moodboardLine = firstName
    ? `${firstName} is building a live closet moodboard with drops they actually plan to wear.`
    : "This profile is a working moodboard of shoppable pieces and resale wins.";
  const invitationLine =
    "Pop into the app to watch it update in real time, stash favorites, and catch the next drop before it disappears.";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${MELIAN_SITE_URL}/external-profile/${profile.userId ?? profile.id}`,
    name: displayName,
    alternateName: handle ? `@${handle}` : undefined,
    description: profile.bio || `${displayName ?? "This fashion insider"} curates a Melian closet with hard-to-find pieces and boutique pulls.`,
    image: profile.picture ?? undefined,
    url: `${MELIAN_SITE_URL}/external-profile/${profile.userId ?? profile.id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-white flex items-center justify-center py-16 px-6 md:px-8 lg:px-12">
        <div className="w-full max-w-4xl">
          <div className="bg-white/90 border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
              <div className="flex flex-col items-center justify-center gap-6 bg-gray-50 px-12 py-12">
                <div className="relative w-32 h-32 rounded-3xl overflow-hidden bg-white shadow-md ring-1 ring-gray-200 flex items-center justify-center">
                  {profile.picture ? (
                    <Image
                      src={profile.picture}
                      alt={displayName ? `${displayName}'s avatar` : "Melian profile avatar"}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  ) : (
                    <span className="text-4xl font-semibold text-gray-600">{getInitials(profile)}</span>
                  )}
                </div>
                <div className="text-center space-y-2">
                  {handle && <p className="text-sm uppercase tracking-[0.3em] text-gray-500">{handle}</p>}
                  <h1 className="text-3xl font-semibold text-gray-900">{displayName ?? "Melian Tastemaker"}</h1>
                </div>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-center">
                    <p className="text-2xl font-semibold text-gray-900">{formatCount(profile.productsCount)}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Pieces tracked</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-center">
                    <p className="text-2xl font-semibold text-gray-900">{formatCount(profile.storesCount)}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Boutiques tapped</p>
                  </div>
                </div>
              </div>

              <div className="px-10 py-12 flex flex-col gap-8">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Melian profile spotlight</p>
                  <h2 className="text-4xl font-bold text-gray-900 leading-tight">{heroTitle}</h2>
                  <p className="text-lg text-gray-600 leading-7">{moodboardLine}</p>
                  <p className="text-lg text-gray-600 leading-7">{invitationLine}</p>
                  {profile.bio ? (
                    <p className="text-base text-gray-500 italic">“{profile.bio}”</p>
                  ) : null}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 text-white px-6 py-4 text-base font-semibold shadow-lg hover:bg-gray-800 transition-colors"
                  >
                    Download Melian
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                  <a
                    href={MELIAN_SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-6 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Browse melian.com
                  </a>
                </div>

                <div className="text-sm text-gray-400">
                  No robots, no recycled inspo—just the closets fashion friends send each other at 1 a.m.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
