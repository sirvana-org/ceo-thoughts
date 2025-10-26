import Image from "next/image";
import Link from "next/link";
import { UserProfileBadge } from "@/components/user-profile-badge";

interface CollectionCardProps {
  collectionId: string;
  ownerUserId: string;
  name: string;
  cover?: string | null;
  previewImages?: string[];
  previewLogos?: string[];
  ownerUserName?: string | null;
  ownerProfilePicture?: string | null;
  priority?: boolean;
}

export function CollectionCard({
  collectionId,
  ownerUserId,
  name,
  cover,
  previewImages = [],
  previewLogos = [],
  ownerUserName,
  ownerProfilePicture,
  priority = false,
}: CollectionCardProps) {
  const hasPreviewImages = previewImages.length > 0;
  const hasPreviewLogos = previewLogos.length > 0;
  const showFullSizeImage = cover || (hasPreviewImages && previewImages.length < 3);
  const showProductGrid = !cover && previewImages.length >= 3;
  const showLogoGrid = !cover && !hasPreviewImages && previewLogos.length >= 3;

  return (
    <Link href={`/collection/${collectionId}`} className="cursor-pointer">
      <div className="group rounded-2xl overflow-hidden flex flex-col gap-2">
        <div className="relative aspect-square w-full">
          {showFullSizeImage ? (
            <Image
              src={cover || previewImages[0]}
              alt={name}
              fill
              sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover rounded-2xl"
              priority={priority}
            />
          ) : showProductGrid ? (
            <div className="flex h-full rounded-2xl overflow-hidden">
              <div className="flex-1 relative">
                {previewImages[0] && (
                  <Image
                    src={previewImages[0]}
                    alt={name}
                    fill
                    sizes="(min-width: 1280px) 10vw, (min-width: 1024px) 12.5vw, (min-width: 768px) 16.5vw, (min-width: 640px) 25vw, 50vw"
                    className="object-cover rounded-l-2xl"
                    priority={priority}
                  />
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 relative">
                  {previewImages[1] && (
                    <Image
                      src={previewImages[1]}
                      alt={name}
                      fill
                      sizes="(min-width: 1280px) 10vw, (min-width: 1024px) 12.5vw, (min-width: 768px) 16.5vw, (min-width: 640px) 25vw, 50vw"
                      className="object-cover rounded-tr-2xl"
                      priority={priority}
                    />
                  )}
                </div>
                <div className="flex-1 relative">
                  {previewImages[2] && (
                    <Image
                      src={previewImages[2]}
                      alt={name}
                      fill
                      sizes="(min-width: 1280px) 10vw, (min-width: 1024px) 12.5vw, (min-width: 768px) 16.5vw, (min-width: 640px) 25vw, 50vw"
                      className="object-cover rounded-br-2xl"
                      priority={priority}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : showLogoGrid ? (
            <div className="flex h-full rounded-2xl overflow-hidden bg-white">
              <div className="flex-1 relative bg-neutral-50 flex items-center justify-center p-4">
                {previewLogos[0] && (
                  <Image
                    src={previewLogos[0]}
                    alt={name}
                    fill
                    sizes="(min-width: 1280px) 10vw, (min-width: 1024px) 12.5vw, (min-width: 768px) 16.5vw, (min-width: 640px) 25vw, 50vw"
                    className="object-contain rounded-l-2xl p-4"
                    priority={priority}
                  />
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 relative bg-white flex items-center justify-center p-4 border-b border-l border-neutral-100">
                  {previewLogos[1] && (
                    <Image
                      src={previewLogos[1]}
                      alt={name}
                      fill
                      sizes="(min-width: 1280px) 10vw, (min-width: 1024px) 12.5vw, (min-width: 768px) 16.5vw, (min-width: 640px) 25vw, 50vw"
                      className="object-contain rounded-tr-2xl p-4"
                      priority={priority}
                    />
                  )}
                </div>
                <div className="flex-1 relative bg-neutral-50 flex items-center justify-center p-4 border-l border-neutral-100">
                  {previewLogos[2] && (
                    <Image
                      src={previewLogos[2]}
                      alt={name}
                      fill
                      sizes="(min-width: 1280px) 10vw, (min-width: 1024px) 12.5vw, (min-width: 640px) 25vw, 50vw"
                      className="object-contain rounded-br-2xl p-4"
                      priority={priority}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-1 p-px">
          <h3 className="text-neutral-blackPrimary subhead-small line-clamp-2">{name}</h3>
          <UserProfileBadge
            userName={ownerUserName}
            profilePicture={ownerProfilePicture}
            userId={ownerUserId}
            size="sm"
            textClassName="text-neutral-blackPrimary body-small"
            asLink={false}
          />
        </div>
      </div>
    </Link>
  );
}
