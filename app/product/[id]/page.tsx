"use client";

import type { Metadata } from "next";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProduct, fetchRelatedProducts } from "@/lib/products";
import type { ProductPage } from "@/types/product";

const appStoreUrl = "https://apps.apple.com/us/app/melian/id6738385324";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<ProductPage | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const productData = await fetchProduct(id);
      if (productData) {
        setProduct(productData);
        const related = await fetchRelatedProducts(id, 20);
        if (related) {
          setRelatedProducts(related);
        }
      }
      setLoading(false);
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const currentImage = product.images?.[selectedImageIndex] || product.images?.[0];
  const displayPrice = product.promotionalPrice || product.price;

  return (
    <div className="min-h-screen bg-white relative pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden">
              {currentImage && (
                <Image
                  src={currentImage.url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? "border-gray-900 ring-2 ring-gray-900"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${product.name} - ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {product.storeLogo && (
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={product.storeLogo}
                    alt={product.storeName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium text-gray-900">{product.storeName}</p>
                </div>
              </div>
            )}

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {displayPrice && (
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {product.currency || "$"}
                    {typeof displayPrice === "number"
                      ? displayPrice.toFixed(2)
                      : displayPrice}
                  </span>
                  {product.promotionalPrice && product.price && (
                    <span className="text-xl text-gray-400 line-through">
                      {product.currency || "$"}
                      {typeof product.price === "number"
                        ? product.price.toFixed(2)
                        : product.price}
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
                <div className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">
                  Brand: {product.brand}
                </div>
              )}
              {product.category && (
                <div className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">
                  {product.category}
                </div>
              )}
              {product.color && (
                <div className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">
                  Color: {product.color}
                </div>
              )}
              {product.condition && (
                <div className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">
                  {product.condition}
                </div>
              )}
            </div>

            <a
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full bg-gray-900 text-white rounded-xl px-8 py-4 flex items-center justify-center gap-3 font-semibold hover:bg-gray-800 transition-colors"
            >
              <span>Get the App to Purchase</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct: any) => (
                <a
                  key={relatedProduct.product_id}
                  href={appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
                    {relatedProduct.image_url && (
                      <Image
                        src={relatedProduct.image_url}
                        alt={relatedProduct.name || "Product"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  {relatedProduct.name && (
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {relatedProduct.name}
                    </h3>
                  )}
                  {relatedProduct.price && (
                    <p className="text-sm text-gray-600">
                      ${typeof relatedProduct.price === "number"
                        ? relatedProduct.price.toFixed(2)
                        : relatedProduct.price}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 left-6 z-50 hidden lg:block">
        <a
          href={appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-6 block hover:bg-white transition-colors border border-gray-200"
        >
          <div className="flex items-center space-x-3 mb-2">
            <img
              src="/assets/logoSmall.png"
              alt="Melian Logo"
              className="w-10 h-10 rounded-full"
            />
            <div className="text-2xl font-semibold text-gray-900">Get the App</div>
          </div>

          <div className="text-sm text-gray-600 mb-3">Effortless shopping</div>

          <div>
            <img
              src="/assets/appStoreBlack.svg"
              alt="Download on the App Store"
              className="h-10 w-auto"
            />
          </div>
        </a>
      </div>

      <div className="block lg:hidden bg-white border-t border-gray-200 p-4 fixed bottom-0 left-0 right-0 z-50">
        <a
          href={appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-900 text-white rounded-xl px-6 py-4 flex items-center justify-center gap-3 w-full font-semibold hover:bg-gray-800 transition-colors"
        >
          <span>Download App</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
