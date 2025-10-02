export async function fetchCollection(collectionId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/ready/${collectionId}`, {
      headers: {
        'Authorization': 'Bearer no-token-secret',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.collection;
  } catch (error) {
    console.error('Error fetching collection:', error);
    return null;
  }
}