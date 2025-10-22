export type ProductPage = {
  id: string;
  url: string;
  category: string | null;
  storeId: string;
  description: string | null;
  name: string;
  price: string | number | null;
  promotionalPrice: string | number | null;
  currency: string;
  stock: boolean;
  condition: string | null;
  color: string | null;
  brand: string | null;
  genero: string | null;
  images: {
    url: string;
    width?: number;
    height?: number;
  }[];
  storeLogo: string;
  storeName: string;
  isLiked: boolean;
};
