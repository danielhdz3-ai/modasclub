export const APP_NAME = "ModasClub";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://modasclub.com";

export const FREE_SHIPPING_THRESHOLD = 50; // €
export const DEFAULT_MARGIN = 2.2;
export const MEMBER_MARGIN = 1.9;
export const COMPARE_AT_MARGIN = 2.5;
export const LOW_STOCK_THRESHOLD = 5;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  processing: "En proceso",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
  disputed: "En disputa",
};

export const ANNOUNCEMENT_MESSAGES = [
  "✦ Envío gratis en pedidos +50€",
  "✦ Precios exclusivos para socias del Club",
  "✦ Nuevas colecciones cada semana",
  "✦ Devoluciones gratuitas 30 días",
];

export const MAIN_CATEGORIES = [
  { name: "Bolsos", slug: "bolsos", emoji: "👜" },
  { name: "Perfumes", slug: "perfumes", emoji: "🌸" },
  { name: "Relojes", slug: "relojes", emoji: "⌚" },
];
