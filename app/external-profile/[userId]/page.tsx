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

const getDisplayName = (profile: ExternalProfile | null) => {
	if (!profile) return undefined;
	return (
		profile.name?.trim() || profile.userName || profile.username || undefined
	);
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

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
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

export default async function ExternalProfilePage({ params }: PageProps) {
	const { userId } = await params;
	const profile = await fetchExternalProfile(userId);

	if (!profile) {
		notFound();
	}

	const displayName = getDisplayName(profile);
	const handle = getHandle(profile);
	const normalizedHandle = handle
		? handle.startsWith("@")
			? handle
			: `@${handle}`
		: undefined;
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "Person",
		"@id": `${MELIAN_SITE_URL}/external-profile/${profile.userId ?? profile.id}`,
		name: displayName,
		alternateName: normalizedHandle,
		description:
			profile.bio ||
			`${displayName ?? "This Melian member"} keeps a Melian closet of fashion finds.`,
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
				<div className="bg-white border border-gray-200 rounded-3xl shadow-lg px-12 py-16 flex flex-col items-center gap-8">
					<div className="relative w-32 h-32 rounded-3xl overflow-hidden bg-gray-50 shadow-md ring-1 ring-gray-200 flex items-center justify-center">
						{profile.picture ? (
							<Image
								src={profile.picture}
								alt={
									displayName
										? `${displayName}'s avatar`
										: "Melian profile avatar"
								}
								fill
								className="object-cover"
								sizes="128px"
							/>
						) : (
							<span className="text-4xl font-semibold text-gray-600">
								{getInitials(profile)}
							</span>
						)}
					</div>

					<div className="text-center space-y-1">
						{normalizedHandle ? (
							<p className="text-sm uppercase tracking-[0.3em] text-gray-500">
								{normalizedHandle}
							</p>
						) : null}
						<h1 className="text-3xl font-semibold text-gray-900">
							{displayName ?? normalizedHandle ?? "Melian User"}
						</h1>
					</div>

					<a
						href={APP_STORE_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 text-white px-8 py-4 text-lg font-semibold shadow-lg transition-colors hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
					>
						Download Melian
					</a>
				</div>
			</div>
		</>
	);
}
