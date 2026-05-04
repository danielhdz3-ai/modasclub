import { z } from "zod";

// Schema for a single product row from CSV/Excel
export const productRowSchema = z.object({
  name: z.string().min(1, "Nombre obligatorio"),
  supplier_sku: z.string().optional(),
  brand: z.string().optional(),
  description: z.string().optional(),
  cost_price: z.coerce.number().min(0).optional(),
  price: z.coerce.number().min(0).optional(),
  stock_quantity: z.coerce.number().int().min(0).optional(),
  images: z.string().optional(), // pipe-separated URLs
  category: z.string().optional(),
  gender: z.enum(["men", "women", "unisex", "kids"]).optional(),
  weight: z.coerce.number().optional(),
  ean: z.string().optional(),
});

export type ProductRow = z.infer<typeof productRowSchema>;

// Schema for newsletter subscription
export const newsletterSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().optional(),
});

// Schema for contact form
export const contactSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  message: z.string().min(10, "El mensaje es demasiado corto"),
});

// Schema for auth
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export const registerSchema = loginSchema.extend({
  full_name: z.string().min(2, "Nombre requerido"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Schema for checkout address
export const addressSchema = z.object({
  full_name: z.string().min(2, "Nombre requerido"),
  line1: z.string().min(5, "Dirección requerida"),
  line2: z.string().optional(),
  city: z.string().min(2, "Ciudad requerida"),
  state: z.string().min(2, "Provincia requerida"),
  postal_code: z.string().regex(/^\d{5}$/, "Código postal inválido"),
  country: z.string().min(2, "País requerido"),
  phone: z.string().optional(),
});
