import type { ExternalProfile } from "@/types/user";

const sanitizeJsonLd = (json: string) =>
  json
    .replace(/<\/(script)/gi, "\\u003C/$1")
    .replace(/</g, "\\u003C")
    .replace(/>/g, "\\u003E")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

interface StructuredDataResult {
  profileId: string;
  sanitizedJsonLd: string;
}

export const buildExternalProfileStructuredData = (
  profile: ExternalProfile,
  fallbackUserId: string,
  baseUrl: string,
): StructuredDataResult => {
  const profileId = profile.userId ?? profile.id ?? fallbackUserId;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/external-profile/${profileId}`,
    name: profile.name ?? profile.userName ?? undefined,
    alternateName: profile.userName,
    description:
      profile.description || `${profile.name ?? "This Melian member"} keeps a Melian closet of fashion finds.`,
    image: profile.picture,
    url: `${baseUrl}/external-profile/${profileId}`,
  };

  return {
    profileId,
    sanitizedJsonLd: sanitizeJsonLd(JSON.stringify(structuredData)),
  };
};
