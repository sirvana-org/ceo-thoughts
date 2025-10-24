"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchProduct } from "@/lib/products";
import { productQueries } from "./product-queries";

const formatPrice = (currency: string | null | undefined, price: number | string) => {
  const symbol = currency || "$";
  return typeof price === "number" ? `${symbol} ${price.toFixed(2)}` : `${symbol} ${price}`;
};

const appStoreUrl = "https://apps.apple.com/us/app/melian/id6738385324";

const DesktopBuyButton = () => {
  return (
    <Button asChild variant="primary" size="lg" className="hidden md:flex">
      <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
        Get the App to Purchase
      </a>
    </Button>
  );
};

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription = ({ description }: ProductDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="max-w-none">
      <p
        className={`body-medium text-neutral-grayPrimary leading-relaxed ${!isExpanded ? "md:line-clamp-none line-clamp-2" : ""}`}
      >
        {description}
      </p>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden text-neutral-blackPrimary body-medium underline mt-2"
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
};

interface ProductInfoProps {
  productId: string;
}

export function ProductInfo({ productId }: ProductInfoProps) {
  const { data } = useQuery({
    queryKey: productQueries.detail({ id: productId }),
    queryFn: () => fetchProduct(productId),
  });

  const product = data?.product;

  if (!product) return null;

  const displayPrice = product.promotionalPrice ?? product.price;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="subhead-large">{product.name}</h1>

        {displayPrice !== null && displayPrice !== undefined && (
          <div className="flex items-baseline gap-3 mb-4">
            <span className="subhead-medium">
              {formatPrice(product.currency, displayPrice)}
            </span>
            {product.promotionalPrice !== null &&
              product.promotionalPrice !== undefined &&
              product.price !== null &&
              product.price !== undefined && (
              <span className="subhead-medium text-neutral-grayPrimary line-through">
                {formatPrice(product.currency, product.price)}
              </span>
            )}
          </div>
        )}
      </div>

      {product.description && <ProductDescription description={product.description as string} />}

      <div className="flex flex-wrap gap-3 pt-4">
        {product.storeName && (
          <Badge variant="secondary" imageUrl={product.storeLogo || undefined} imageAlt={product.storeName}>
            {product.storeName}
          </Badge>
        )}
        {product.brand && <Badge variant="secondary">{product.brand}</Badge>}
        {product.category && <Badge variant="secondary">{product.category}</Badge>}
        {product.color && <Badge variant="secondary">{product.color}</Badge>}
        {product.condition && <Badge variant="secondary">{product.condition}</Badge>}
      </div>
      <DesktopBuyButton />
    </div>
  );
}
