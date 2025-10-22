import type { OutfitPage } from "@/types/outfit";

export async function fetchOutfit(outfitId: string): Promise<OutfitPage | null> {
  if (!outfitId) return null;

  const url = `${process.env.NEXT_PUBLIC_API_URL}/outfits/${outfitId}?includeProducts=true&limit=24&offset=0`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      method: "GET",
      headers: {
        Authorization: "Bearer no-token-secret",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.outfit;
  } catch {
    return null;
  }
}
