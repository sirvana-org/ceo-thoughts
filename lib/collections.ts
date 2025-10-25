import type { StoreInfo } from "@/types/store";

export interface CollectionProduct {
  product_id: string;
  image_url?: string;
  name?: string;
  price?: number;
  price_currency?: string;
  width?: number;
  height?: number;
  brand?: string;
  store_id?: string;
  store_name?: string;
}

export interface CollectionProductsPage {
  products: CollectionProduct[];
  limit: number;
  offset: number;
  total?: number;
}

export interface CollectionUser {
  id: string;
  name: string;
  profilePicture: string;
}

export interface Collection {
  id: string;
  name: string;
  subtitle?: string;
  cover?: string;
  isPrivate: boolean;
  createdAt: string;
  previewImages?: string[];
  isBookmarked: boolean;
  isOwner: boolean;
  storesCount: number;
  productsCount: number;
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
}

export async function fetchCollection(collectionId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/ready/${collectionId}`, {
      cache: "no-store",
      headers: {
        Authorization: "Bearer no-token-secret",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.collection;
  } catch (error) {
    console.error("Error fetching collection:", error);
    return null;
  }
}

export type CollectionStore = {
  store_id: string;
  url: string;
  name: string;
  page_title: string;
  logo: string;
  description: string | null;
  keywords: string | null;
  categories: string[];
  crawled_at: string;
  run_id: string;
  store_info_error: string | null;
  is_official_brand: boolean | null;
  is_brand: boolean;
  brand_name: string;
  tags: string[];
  created_at: string;
};

export type CollectionPage = {
  id: string;
  name: string;
  cover: string | null;
  subtitle: string | null;
  isPrivate: boolean;
  createdAt: string;
  previewImages: string[];
  isBookmarked: boolean;
  isOwner: boolean;
  storesCount: number;
  productsCount: number;
  stores: CollectionStore[];
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
};

export type CollectionPageResponse = {
  collection: CollectionPage;
  user: {
    userId: string | null;
    userName: string;
    userProfilePicture: string;
    userIsOwner: boolean;
  };
};

export async function fetchCollectionWithUser(collectionId: string): Promise<CollectionPageResponse | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/ready/${collectionId}`, {
      cache: "no-store",
      headers: {
        Authorization: "Bearer no-token-secret",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching collection with user:", error);
    return null;
  }
}

export async function fetchCollectionProducts(
  collectionId: string,
  limit = 24,
  offset = 0,
): Promise<CollectionProductsPage> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/collections/ready/${collectionId}/products?limit=${limit}&offset=${offset}`,
      {
        cache: "no-store",
        headers: {
          Authorization: "Bearer no-token-secret",
        },
      },
    );

    if (!response.ok) {
      return {
        products: [],
        limit,
        offset,
      };
    }

    const data = await response.json();
    const products = Array.isArray(data?.products)
      ? (data.products as CollectionProduct[])
      : Array.isArray(data?.data)
        ? (data.data as CollectionProduct[])
        : [];

    const total =
      typeof data?.total === "number"
        ? data.total
        : typeof data?.productsCount === "number"
          ? data.productsCount
          : typeof data?.count === "number"
            ? data.count
            : typeof data?.pagination?.total === "number"
              ? data.pagination.total
              : undefined;

    return {
      products,
      limit,
      offset,
      total,
    };
  } catch (error) {
    console.error("Error fetching collection products:", error);
    return {
      products: [],
      limit,
      offset,
    };
  }
}

export interface UserCollection {
  id: string;
  name: string;
  subtitle?: string;
  cover?: string | null;
  is_private: boolean;
  user_id: string;
  isAdded: boolean;
  previewImages: string[];
  isOwner: boolean;
  ownerUserName: string | null;
  ownerProfilePicture?: string | null;
}

export interface UserCollectionsPage {
  collections: UserCollection[];
  limit: number;
  offset: number;
}

export async function fetchUserCollections(userId: string, limit = 21, offset = 0): Promise<UserCollectionsPage> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/collections/ready/user/${userId}?limit=${limit}&offset=${offset}`,
      {
        cache: "no-store",
        headers: {
          Authorization: "Bearer no-token-secret",
        },
      },
    );

    if (!response.ok) {
      return {
        collections: [],
        limit,
        offset,
      };
    }

    const data = await response.json();
    const collections = Array.isArray(data?.collections) ? (data.collections as UserCollection[]) : [];

    return {
      collections,
      limit,
      offset,
    };
  } catch (error) {
    console.error("Error fetching user collections:", error);
    return {
      collections: [],
      limit,
      offset,
    };
  }
}

export interface CollectionStoresPage {
  stores: StoreInfo[];
  limit: number;
  offset: number;
}

export async function fetchCollectionStores(
  collectionId: string,
  limit = 20,
  offset = 0,
): Promise<CollectionStoresPage> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/collections/ready/${collectionId}/stores?limit=${limit}&offset=${offset}`,
      {
        cache: "no-store",
        headers: {
          Authorization: "Bearer no-token-secret",
        },
      },
    );

    if (!response.ok) {
      return {
        stores: [],
        limit,
        offset,
      };
    }

    const data = await response.json();
    const stores = Array.isArray(data) ? (data as StoreInfo[]) : [];

    return {
      stores,
      limit,
      offset,
    };
  } catch (error) {
    console.error("Error fetching collection stores:", error);
    return {
      stores: [],
      limit,
      offset,
    };
  }
}
