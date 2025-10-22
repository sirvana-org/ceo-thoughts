export async function fetchCollection(collectionId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/ready/${collectionId}`, {
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

export async function fetchCollectionWithUser(collectionId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/ready/${collectionId}`, {
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

export async function fetchCollectionProducts(collectionId: string, limit = 24, offset = 0) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/collections/ready/${collectionId}/products?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: "Bearer no-token-secret",
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching collection products:", error);
    return null;
  }
}
