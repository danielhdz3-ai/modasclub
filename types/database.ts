export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "customer" | "member" | "partner" | "admin";
export type MembershipStatus = "free" | "active" | "cancelled";
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "discontinued";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "disputed";
export type ImportStatus = "pending" | "processing" | "completed" | "failed";
export type ImageSource = "supplier" | "ai_enhanced" | "ai_generated" | "manual";
export type DiscountType = "percentage" | "fixed" | "free_shipping";
export type Gender = "men" | "women" | "unisex" | "kids";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  membership_status: MembershipStatus;
  membership_expires_at: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  website: string | null;
  contact_email: string | null;
  contact_name: string | null;
  import_method: "csv" | "excel" | "manual";
  last_sync_at: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
}

export interface ProductImage {
  url: string;
  alt: string | null;
  is_primary: boolean;
  source: ImageSource;
  original_url?: string | null;
}

export interface Product {
  id: string;
  supplier_id: string | null;
  category_id: string | null;
  sku: string;
  supplier_sku: string | null;
  name: string;
  slug: string;
  description: string | null;
  description_ai: string | null;
  short_description: string | null;
  brand: string | null;
  gender: Gender | null;
  cost_price: number | null;
  price: number;
  member_price: number | null;
  compare_at_price: number | null;
  stock_quantity: number;
  stock_status: StockStatus;
  low_stock_threshold: number;
  /** Si viene vacío desde API, usar `primary_image_url`. */
  images?: ProductImage[];
  /** Columna en Supabase; la tienda la usa si no hay filas en `product_images`. */
  primary_image_url?: string | null;
  video_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[] | null;
  is_active: boolean;
  is_featured: boolean;
  ai_enhanced: boolean;
  attributes: Record<string, string | number | boolean>;
  weight_grams: number | null;
  created_at: string;
  updated_at: string;
  // Relations
  category?: Category;
  supplier?: Supplier;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  name: string;
  attributes: Record<string, string | number>;
  price: number | null;
  member_price: number | null;
  stock_quantity: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  supplier_id: string | null;
  product_name: string;
  product_sku: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  cost_price: number | null;
  total_price: number;
  image_url: string | null;
  created_at: string;
}

export interface ShippingAddress {
  full_name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total: number;
  stripe_payment_intent_id: string | null;
  stripe_charge_id: string | null;
  payment_status: string;
  shipping_address: ShippingAddress;
  billing_address: ShippingAddress | null;
  shipping_method: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  supplier_order_ref: string | null;
  supplier_notified_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  items?: OrderItem[];
  profile?: Profile;
}

export interface CartItem {
  id: string;
  user_id: string | null;
  session_id: string | null;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  created_at: string;
  updated_at: string;
  // Relations
  product?: Product;
  variant?: ProductVariant;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_item_id: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  profile?: Pick<Profile, "full_name" | "avatar_url">;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number | null;
  minimum_order: number;
  max_uses: number | null;
  used_count: number;
  is_member_only: boolean;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  source: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export interface SupplierImport {
  id: string;
  supplier_id: string;
  filename: string | null;
  total_rows: number | null;
  imported_rows: number | null;
  updated_rows: number | null;
  error_rows: number | null;
  errors: Array<{ row: number; sku: string; error: string }>;
  status: ImportStatus;
  started_at: string | null;
  completed_at: string | null;
  created_by: string | null;
  created_at: string;
}
