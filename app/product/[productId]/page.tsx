import { fetchProduct } from "@/lib/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    productId: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await fetchProduct(productId);

  if (!product) {
    return {
      title: "Product not found | Sirvana",
      description: "The requested product could not be found.",
    };
  }

  const firstImage = product.images?.[0];
  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      type: "website",
      url: product.url ?? `https://melian.com/product/${product.id}`,
      siteName: product.storeName,
      images: product.images?.map((img) => ({
        url: img.url,
        width: img.width,
        height: img.height,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description ?? undefined,
      images: firstImage ? [firstImage.url] : undefined,
    },
    alternates: {
      canonical: product.url ?? undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { productId } = await params;
  const product = await fetchProduct(productId);

  if (!product) {
    notFound();
  }

  return null;
}
