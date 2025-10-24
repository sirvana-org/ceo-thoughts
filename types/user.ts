export interface ExternalProfile {
  userId: string;
  id: string;
  name: string | null;
  userName: string | null;
  email: string | null;
  picture: string | null;
  description: string | null;
  storesCount: number;
  productsCount: number;
  isFollowing: boolean;
  isSelf: boolean;
}
