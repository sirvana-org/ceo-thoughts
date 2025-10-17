export interface ExternalProfile {
  id: string;
  userId?: string;
  email?: string | null;
  name?: string | null;
  userName?: string | null;
  username?: string | null;
  picture?: string | null;
  bio?: string | null;
  productsCount?: number;
  storesCount?: number;
}
