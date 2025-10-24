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

export interface CollectionWithUser {
  collection: Collection;
  user: {
    userId: string;
    userName: string;
    userProfilePicture: string;
    userIsOwner: boolean;
  } | null;
}

export async function fetchCollectionWithUser(collectionId: string): Promise<CollectionWithUser | null> {
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

    // Map user field into correct shape or null
    const user =
      data.user && typeof data.user === "object"
        ? {
            userId: data.user.userId,
            userName: data.user.userName,
            userProfilePicture: data.user.userProfilePicture,
            userIsOwner: data.user.userIsOwner,
          }
        : null;

    // Attach user to the collection object
    const collectionWithUser: CollectionWithUser = {
      collection: {
        ...data.collection,
      },
      user,
    };

    return collectionWithUser;
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
