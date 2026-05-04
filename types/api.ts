export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ColumnMapping {
  supplier_sku?: string;
  name: string;
  brand?: string;
  description?: string;
  cost_price?: string;
  price?: string;
  stock_quantity?: string;
  images?: string;
  category?: string;
  gender?: string;
  weight?: string;
  ean?: string;
  [key: string]: string | undefined;
}

export interface ImportResult {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  errors: Array<{ row: number; sku: string; error: string }>;
}

export interface CheckoutLineItem {
  product_id: string;
  variant_id: string | null;
  quantity: number;
}

export interface CreateOrderPayload {
  line_items: CheckoutLineItem[];
  shipping_address: {
    full_name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
  };
  coupon_code?: string;
}
