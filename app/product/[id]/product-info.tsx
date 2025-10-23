"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { fetchProduct, productQueries } from "./product-queries";

const appStoreUrl = "https://apps.apple.com/us/app/melian/id6738385324";

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
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
            <Image src={product.storeLogo} alt={product.storeName} fill className="object-cover" />
          </div>
          <div>
            <p className="text-sm text-gray-500">From</p>
            <p className="font-medium text-gray-900">{product.storeName}</p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

        {displayPrice && (
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-gray-900">
              {product.currency || "$"}
              {typeof displayPrice === "number" ? displayPrice.toFixed(2) : displayPrice}
            </span>
            {product.promotionalPrice && product.price && (
              <span className="text-xl text-gray-400 line-through">
                {product.currency || "$"}
                {typeof product.price === "number" ? product.price.toFixed(2) : product.price}
              </span>
            )}
          </div>
        )}
      </div>

      {product.description && (
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-4">
        {product.brand && (
          <div className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">Brand: {product.brand}</div>
        )}
        {product.category && (
          <div className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">{product.category}</div>
        )}
        {product.color && (
          <div className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">Color: {product.color}</div>
        )}
        {product.condition && (
          <div className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">{product.condition}</div>
        )}
      </div>

      <a
        href={appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 w-full bg-gray-900 text-white rounded-xl px-8 py-4 flex items-center justify-center gap-3 font-semibold hover:bg-gray-800 transition-colors"
      >
        <span>Get the App to Purchase</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Arrow right">
          <title>Arrow right</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    </div>
  );
}
