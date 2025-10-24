import { AppStoreHeader } from "./app-store-header";

export default function ExternalProfileLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      <div className="flex flex-col items-center gap-4 mb-8 md:mb-12">
        <div className="w-[88px] h-[88px] rounded-full bg-gray-200 animate-pulse" />

        <div className="flex flex-col items-center gap-1">
          <div className="h-7 w-40 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-5 w-56 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="w-full max-w-7xl">
        <section className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div
                  className="w-full bg-gray-200 rounded-lg animate-pulse"
                  style={{ height: `${250 + (i % 3) * 40}px` }}
                />
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
