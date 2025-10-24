import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";



interface ProductCardProps {
  productId: string;
  imageUrl?: string;
  name?: string;
  price?: number;
  priceCurrency?: string;
  brand?: string;
  width?: number;
  height?: number;
}

function formatPrice(price: number, currency?: string) {
  const symbol = currency ?? "$";
  return `${symbol}${price.toFixed(2)}`;
}

export function ProductCard({ productId, imageUrl, name, price, priceCurrency, brand, width, height }: ProductCardProps) {
  const aspectRatio = width && height && height > 0 ? width / height : undefined;
  const shouldShowPrice = typeof price === "number" && Number.isFinite(price);

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
              <Badge variant="secondary" className="text-xs text-neutral-grayPrimary rounded-lg max-w-[50%] block overflow-hidden text-ellipsis whitespace-nowrap group-hover:opacity-20 transition-opacity duration-300">
                {brand}
              </Badge>
            )}
            {shouldShowPrice && (
              <Badge variant="secondary" className="text-xs text-neutral-grayPrimary group-hover:opacity-20 transition-opacity duration-300">
                {formatPrice(price, priceCurrency)}
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
