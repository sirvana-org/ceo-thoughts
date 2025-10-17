import type { ExternalProfile } from "@/types/user";

const AUTH_HEADER = {
  Authorization: "Bearer no-token-secret",
};

export async function fetchExternalProfile(userId: string): Promise<ExternalProfile | null> {
  if (!userId) {
    return null;
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/user/account/${userId}`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: AUTH_HEADER,
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as ExternalProfile;
    return data ?? null;
  } catch {
    return null;
  }
}
