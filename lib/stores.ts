import type { StoreInfo } from "@/types/store";

export async function fetchStore(storeId: string): Promise<StoreInfo | null> {
	if (!storeId) return null;

	const url = `${process.env.NEXT_PUBLIC_API_URL}/stores/${encodeURIComponent(storeId)}`;
	try {
		const res = await fetch(url, {
			cache: "no-store",
			method: "GET",
			headers: {
				'Authorization': 'Bearer no-token-secret',
			},
		});

		if (!res.ok) return null;

		const data = await res.json();
		return data.store as StoreInfo;
	} catch {
		return null;
	}
}

export async function fetchStoreProducts(storeId: string, limit = 24, offset = 0): Promise<any | null> {
	if (!storeId) return null;

	const url = `${process.env.NEXT_PUBLIC_API_URL}/products/ready?size=${limit}&from=${offset}&store_id=${encodeURIComponent(storeId)}`;
	try {
		const res = await fetch(url, {
			cache: "no-store",
			method: "GET",
			headers: {
				'Authorization': 'Bearer no-token-secret',
			},
		});

		if (!res.ok) return null;

		const data = await res.json();
		return data;
	} catch {
		return null;
	}
}
