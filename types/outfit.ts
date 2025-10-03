export interface OutfitImage {
  url: string;
  width: number;
  height: number;
  relevance: number | null;
  brandTags?: {
    id: string;
    brandId: string;
    brandName: string;
    brandLogo: string | null;
    xCoord: number;
    yCoord: number;
    url: string | null;
  }[];
}

export interface OutfitUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

export interface OutfitPage {
  id: string;
  caption: string | null;
  postedAt: string;
  likes: number;
  comments: number;
  images: OutfitImage[];
  user?: OutfitUser;
  similarProducts?: {
    product_id: string;
    name: string;
    price: number;
    image_url: string;
  }[];
}
