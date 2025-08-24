import type { StoreInfo } from "@/types/store";

export async function fetchStore(storeId: string): Promise<StoreInfo | null> {
	if (!storeId) return null;

	const url = `https://backend-ts-cocg.onrender.com/stores/${encodeURIComponent(storeId)}`;
	try {
		const res = await fetch(url, {
			cache: "no-store",
			method: "GET",
		});

		if (!res.ok) return null;

		const data = await res.json();
		return data.store as StoreInfo;
	} catch {
		return null;
	}
}
