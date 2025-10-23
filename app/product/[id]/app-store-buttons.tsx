import Image from "next/image";
import { Button } from "@/components/ui/button";

const appStoreUrl = "https://apps.apple.com/us/app/melian/id6738385324";

export function AppStoreButtons() {
  return (
    <>
      {/* Desktop */}
      <div className="fixed bottom-6 left-6 z-50 hidden lg:block">
        <Button asChild variant="primary" size="md" className="w-full">
          <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
            <div className="flex flex-col items-start">
              <div className="flex items-center space-x-3 mb-2">
                <Image src="/assets/logoSmall.png" alt="Melian Logo" width={40} height={40} className="rounded-full" />
                <div className="text-2xl font-semibold">Get the App</div>
              </div>

              <div className="text-sm mb-3">Effortless shopping</div>

              <div>
                <Image src="/assets/appStoreBlack.svg" alt="Download on the App Store" width={120} height={40} />
              </div>
            </div>
          </a>
        </Button>
      </div>

      {/* Mobile */}
      <div className="block lg:hidden bg-white border-t border-gray-200 p-4 fixed bottom-0 left-0 right-0 z-50">
        <Button asChild variant="primary" size="lg" className="w-full">
          <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
            <span>Download App</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Arrow right">
              <title>Arrow right</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </Button>
      </div>
    </>
  );
}
