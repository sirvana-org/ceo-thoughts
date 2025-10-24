const THUMB_SKELETON_KEYS = ["thumb-1", "thumb-2", "thumb-3", "thumb-4"] as const;
const BADGE_SKELETON_KEYS = ["badge-1", "badge-2", "badge-3", "badge-4"] as const;
const GRID_SKELETON_ITEMS = Array.from({ length: 10 }, (_, index) => ({
  id: `grid-${index + 1}`,
  aspectRatio: index % 3 === 0 ? "3/4" : index % 2 === 0 ? "4/5" : "1/1",
}));

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white relative pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12">
          {/* Image Gallery Skeleton */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[3/4] border border-neutral-graySecondary rounded-3xl overflow-hidden bg-neutral-graySecondary animate-pulse" />

            {/* Thumbnails Skeleton */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {THUMB_SKELETON_KEYS.map((key) => (
                <div
                  key={key}
                  className="relative flex-shrink-0 w-20 h-20 rounded-2xl border border-neutral-graySecondary bg-neutral-graySecondary animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="flex flex-col gap-6">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <div className="h-8 w-3/4 bg-neutral-graySecondary animate-pulse rounded" />

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <div className="h-7 w-24 bg-neutral-graySecondary animate-pulse rounded" />
              </div>
            </div>

            {/* Description */}
            <div className="max-w-none space-y-2">
              <div className="h-5 w-full bg-neutral-graySecondary animate-pulse rounded" />
              <div className="h-5 w-full bg-neutral-graySecondary animate-pulse rounded" />
              <div className="h-5 w-2/3 bg-neutral-graySecondary animate-pulse rounded" />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 pt-4">
              {BADGE_SKELETON_KEYS.map((key) => (
                <div key={key} className="h-8 w-20 bg-neutral-graySecondary animate-pulse rounded-full" />
              ))}
            </div>

            {/* Desktop Button */}
            <div className="hidden md:block h-12 w-48 bg-neutral-graySecondary animate-pulse rounded-lg" />
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="border-t border-neutral-graySecondary pt-12">
          <div className="h-8 w-48 bg-neutral-graySecondary animate-pulse rounded mb-8" />

          {/* Masonry Grid Skeleton - Mobile First */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {GRID_SKELETON_ITEMS.map((item) => (
              <div key={item.id} className="flex flex-col gap-2">
                <div
                  className="w-full bg-neutral-graySecondary animate-pulse rounded-2xl"
                  style={{ aspectRatio: item.aspectRatio }}
                />
                <div className="h-4 w-3/4 bg-neutral-graySecondary animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-neutral-graySecondary animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Buy Button */}
      <div className="block lg:hidden bg-white border-t border-gray-200 p-4 fixed bottom-0 left-0 right-0 z-50">
        <div className="h-12 w-full bg-neutral-graySecondary animate-pulse rounded-lg" />
      </div>
    </div>
  );
}
