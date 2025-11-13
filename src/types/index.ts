export interface UrlData {
  id?: number;
  original_url: string;
  short_code: string;
  clicks: number;
  is_custom: boolean; // boolean in frontend
  password?: string | null;
  expires_at?: string | null;
  is_active: boolean; // boolean in frontend
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  err: boolean;
  result?: T;
  count?: number;
}

export interface CreateResponse {
  lastInsertID: number;
  affectedRows: number;
}
