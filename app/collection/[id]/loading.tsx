export default function CollectionLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-8 md:gap-12 justify-start p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-6">
        {/* Optional cover image skeleton */}
        <div className="relative w-full md:w-[300px] h-[300px] bg-gray-200 rounded-[30px] md:rounded-[14px] animate-pulse" />

        {/* Header content skeleton */}
        <div className="flex flex-col gap-2 md:gap-4 flex-1">
          {/* Mobile user badge skeleton */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Title and subtitle */}
          <div className="flex flex-col gap-2 md:gap-4">
            <div className="h-8 md:h-10 bg-gray-200 rounded-lg animate-pulse w-3/4" />
            <div className="h-5 md:h-6 bg-gray-200 rounded animate-pulse w-full" />
          </div>

          {/* Desktop user badge skeleton */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Products Section Skeleton */}
      <section>
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4" />

        {/* Masonry grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div
                className="w-full bg-gray-200 rounded-lg animate-pulse"
                style={{ height: `${200 + (i % 3) * 50}px` }}
              />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
