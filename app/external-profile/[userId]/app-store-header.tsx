import Image from "next/image";

export function AppStoreHeader() {
  return (
    <>
      <div className="sticky top-0 z-50 bg-white border-b border-neutral-graySecondary md:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Image
                src="/assets/logoSmall.png"
                alt="Melian Logo"
                width={40}
                height={40}
                className="flex-shrink-0"
                priority
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-neutral-blackPrimary body-medium  text-[15px] !leading-tight">Get the app</h2>
                <p className="text-neutral-blackPrimary body-small text-[15px] !leading-tight">
                  Search <span className="font-plusJakartaSansMedium">Melian</span> in the App Store
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden min-[1200px]:block fixed bottom-6 left-6 z-50">
        <a
          href="https://apps.apple.com/us/app/melian/id6738385324"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/80 backdrop-blur-md text-gray-900 rounded-2xl block w-full"
        >
          {/* Header with logo */}
          <div className="flex items-center space-x-2 mb-2">
            <Image src="/assets/logoSmall.png" alt="Melian Logo" width={32} height={32} className="rounded-full" />
            <div className="text-2xl font-semibold">Get the App</div>
          </div>

          {/* Description */}
          <div className="text-md text-gray-600 mb-3">Effortless shopping</div>

          {/* App Store Badge */}
          <div>
            <Image src="/assets/appStoreBlack.svg" alt="Download on the App Store" width={120} height={32} />
          </div>
        </a>
      </div>
    </>
  );
}
