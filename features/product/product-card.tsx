import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";



interface ProductCardProps {
  productId: string;
  imageUrl?: string;
  name?: string;
  price?: number;
  brand?: string;
  width?: number;
  height?: number;
}

export function ProductCard({ productId, imageUrl, name, price, brand, width, height }: ProductCardProps) {
  const aspectRatio = width && height && height > 0 ? width / height : undefined;

  return (
    <Link href={`/product/${productId}`} className="cursor-pointer">
      <div
        className={`group relative rounded-xl overflow-hidden border border-neutral-graySecondary  ${!aspectRatio ? "aspect-[3/4]" : ""}`}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={name || "Product"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-2 flex flex-col gap-1">
          <div className="flex flex-row gap-2">
            {brand && (
              <Badge variant="secondary" className="text-xs text-neutral-grayPrimary rounded-lg group-hover:opacity-20 transition-opacity duration-300">
                {brand}
              </Badge>
            )}
            {price && (
              <Badge variant="secondary" className="text-xs text-neutral-grayPrimary group-hover:opacity-20 transition-opacity duration-300">
                ${typeof price === "number" ? price.toFixed(2) : price}
              </Badge>
            )}
          </div>
          {name && (
            <Badge variant="secondary" className="text-xs text-neutral-grayPrimary rounded-lg w-full block overflow-hidden text-ellipsis whitespace-nowrap group-hover:opacity-20 transition-opacity duration-300">
              {name}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}

