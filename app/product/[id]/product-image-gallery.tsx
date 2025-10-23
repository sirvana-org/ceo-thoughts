"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { fetchProduct, productQueries } from "./product-queries";

interface ProductImageGalleryProps {
  productId: string;
}

export function ProductImageGallery({ productId }: ProductImageGalleryProps) {
  const { data: product } = useQuery({
    queryKey: productQueries.detail({ id: productId }),
    queryFn: fetchProduct,
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const currentImage = product?.images[selectedImageIndex] || product?.images[0];

  // Check if image is landscape (wider than tall)
  const isLandscape = currentImage?.width && currentImage?.height && currentImage.width > currentImage.height;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[3/4] bg-transparent border border-gray-300 rounded-3xl overflow-hidden">
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

      {product?.images.length && product?.images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {product?.images.map((img, idx) => {
            const isThumbnailLandscape = img.width && img.height && img.width > img.height;
            return (
              <button
                key={img.url}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIndex === idx
                    ? "border-gray-900 ring-2 ring-gray-900"
                    : "border-gray-200 hover:border-gray-400"
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
