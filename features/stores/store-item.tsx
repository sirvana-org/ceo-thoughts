import Image from "next/image";
import type { StoreInfo } from "@/types/store";
import Link from "next/link";

interface StoreItemProps {
  store: StoreInfo;
}

export function StoreItem({ store }: StoreItemProps) {
  return (
<Link href={`/stores/${store.id}`} className="cursor-pointer block">
<div className="flex items-center gap-3">
    {store.logo ? (
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
          <Image src={store.logo} alt={store.name} fill className="object-contain" />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="body-small text-neutral-blackPrimary truncate">{store.name}</p>
      </div>
    </div>
</Link>
  );
}

