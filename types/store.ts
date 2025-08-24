export interface StoreInfo {
  id: string;
  url: string;
  description: string | null;
  keywords: string | null;
  logo: string | null;
  name: string;
  page_title: string | null;
  upload_ts: string | null;
  verified: boolean | null;
  rank: number;
  categories: string | null;
  domain_id: string | null;
  store_real_url_id: string | null;
  isAdded?: boolean;
}