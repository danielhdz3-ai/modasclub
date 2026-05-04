export interface CartStoreItem {
  product_id: string;
  variant_id: string | null;
  quantity: number;
  name: string;
  price: number;
  member_price: number | null;
  image_url: string | null;
  sku: string;
  slug: string;
  variant_name: string | null;
  stock_quantity: number;
}

export interface WishlistStoreItem {
  product_id: string;
  name: string;
  price: number;
  image_url: string | null;
  slug: string;
}

export interface FilterState {
  category?: string;
  brand?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: "relevance" | "price_asc" | "price_desc" | "newest";
  search?: string;
}
