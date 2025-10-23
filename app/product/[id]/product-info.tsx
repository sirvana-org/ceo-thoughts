"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchProduct, productQueries } from "./product-queries";

const appStoreUrl = "https://apps.apple.com/us/app/melian/id6738385324";

const DesktopBuyButton = () => {
  return (
    <Button asChild variant="primary" size="lg">
      <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
        Get the App to Purchase
      </a>
    </Button>
  );
};
interface ProductInfoProps {
  productId: string;
}

export function ProductInfo({ productId }: ProductInfoProps) {
  const { data: product } = useQuery({
    queryKey: productQueries.detail({ id: productId }),
    queryFn: fetchProduct,
  });

  if (!product) return null;

  const displayPrice = product.promotionalPrice || product.price;

  return (
    <div className="flex flex-col gap-6">
      {product.storeLogo && (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-graySecondary">
            <Image src={product.storeLogo} alt={product.storeName} fill className="object-cover" />
          </div>
          <div>
            <p className="text-sm text-neutral-grayPrimary">From</p>
            <p className="font-medium text-neutral-blackPrimary">{product.storeName}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h1 className="headline-medium">{product.name}</h1>

        {displayPrice && (
          <div className="flex items-baseline gap-3 mb-4">
            <span className="subhead-medium">
              {product.currency || "$"}
              {typeof displayPrice === "number" ? displayPrice.toFixed(2) : displayPrice}
            </span>
            {product.promotionalPrice && product.price && (
              <span className="subhead-medium text-neutral-grayPrimary line-through">
                {product.currency || "$"}
                {typeof product.price === "number" ? product.price.toFixed(2) : product.price}
              </span>
            )}
          </div>
        )}
      </div>

      {product.description && (
        <div className="max-w-none">
          <p className="body-medium text-neutral-grayPrimary leading-relaxed">{product.description}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-4">
        {product.brand && <Badge variant="secondary">{product.brand}</Badge>}
        {product.category && <Badge variant="secondary">{product.category}</Badge>}
        {product.color && <Badge variant="secondary">{product.color}</Badge>}
        {product.condition && <Badge variant="secondary">{product.condition}</Badge>}
      </div>
      <DesktopBuyButton />
    </div>
  );
}
