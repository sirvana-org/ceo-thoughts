import Image from "next/image";

export function AppStoreHeader() {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-neutral-graySecondary">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Image src="/assets/logoSmall.png" alt="Melian Logo" width={40} height={40} className="flex-shrink-0" />
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
  );
}
