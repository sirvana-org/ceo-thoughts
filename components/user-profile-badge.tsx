import Image from "next/image";

interface UserProfileBadgeProps {
  userName?: string | null;
  profilePicture?: string | null;
  size?: "sm" | "md" | "lg";
  textClassName?: string;
  showFlexWrapper?: boolean;
}

const sizeMap = {
  sm: "w-5 h-5",
  md: "w-6 h-6 md:w-8 md:h-8",
  lg: "w-8 h-8 md:w-10 md:h-10",
};

export function UserProfileBadge({
  userName,
  profilePicture,
  size = "md",
  textClassName = "body-medium text-neutral-blackPrimary",
  showFlexWrapper = false,
}: UserProfileBadgeProps) {
  if (!userName) return null;

  return (
    <div className="flex flex-row items-center gap-2 md:gap-3">
      {profilePicture && (
        <div className={`relative ${sizeMap[size]} rounded-full overflow-hidden`}>
          <Image src={profilePicture} alt={userName} fill className="object-cover" />
        </div>
      )}

      {showFlexWrapper ? (
        <div className="flex-1 pt-1">
          <p className={textClassName}>{userName}</p>
        </div>
      ) : (
        <span className={textClassName}>{userName}</span>
      )}
    </div>
  );
}
