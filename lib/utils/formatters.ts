/**
 * Format a price as currency string
 */
export function formatPrice(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date in Spanish locale
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...options,
  }).format(d);
}

/**
 * Generate a URL-safe slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Generate a unique product slug
 */
export function generateProductSlug(name: string, brand: string, sku: string): string {
  return `${slugify(brand)}-${slugify(name)}-${sku.toLowerCase()}`;
}

/**
 * Generate order number: MC-YYYY-NNNNN
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `MC-${year}-${random}`;
}

/**
 * Calculate prices from cost price
 */
export function calculatePrices(costPrice: number) {
  return {
    price: Math.ceil(costPrice * 2.2),
    member_price: Math.ceil(costPrice * 1.9),
    compare_at_price: Math.ceil(costPrice * 2.5),
  };
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Parse a price string to a number, handling commas
 */
export function parsePrice(value: string | number): number {
  if (typeof value === "number") return value;
  return parseFloat(value.replace(",", ".")) || 0;
}
