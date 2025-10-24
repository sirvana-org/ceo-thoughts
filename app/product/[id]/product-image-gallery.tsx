"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { fetchProduct } from "@/lib/products";
import { productQueries } from "./product-queries";

interface ProductImageGalleryProps {
  productId: string;
}

export function ProductImageGallery({ productId }: ProductImageGalleryProps) {
  const { data } = useQuery({
    queryKey: productQueries.detail({ id: productId }),
    queryFn: () => fetchProduct(productId),
  });

  const product = data?.product;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  console.log(product);
  const currentImage = product?.images[selectedImageIndex] || product?.images[0];
  const isLandscape = currentImage?.width && currentImage?.height && currentImage.width > currentImage.height;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[3/4] border border-neutral-graySecondary rounded-3xl overflow-hidden">
        {currentImage && (
          <Image
            src={currentImage.url}
            alt={product?.name || ""}
            fill
            className={isLandscape ? "object-contain" : "object-cover"}
            priority
          />
        )}
      </div>

      {product?.images && product?.images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {product?.images.map((img, idx) => {
            const isThumbnailLandscape = img.width && img.height && img.width > img.height;
            return (
              <button
                key={img.url}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border transition-all ${
                  selectedImageIndex === idx
                    ? "border-neutral-grayPrimary border-2"
                    : "border-neutral-graySecondary hover:border-neutral-grayPrimary"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`${product?.name || ""} - ${idx + 1}`}
                  fill
                  className={isThumbnailLandscape ? "object-contain" : "object-cover"}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
