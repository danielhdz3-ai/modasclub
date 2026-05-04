"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUIStore } from "@/store/uiStore";
import { Sparkles, Loader2 } from "lucide-react";
import slugify from "slugify";

interface Category {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  name: string;
}

interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  supplier_sku: string;
  cost_price: string;
  price: string;
  member_price: string;
  compare_at_price: string;
  stock_quantity: string;
  stock_status: string;
  gender: string;
  category_id: string;
  supplier_id: string;
  primary_image_url: string;
  is_active: boolean;
  is_featured: boolean;
  tags: string;
}

interface ProductFormProps {
  initial?: Partial<ProductFormData>;
  categories: Category[];
  suppliers: Supplier[];
  mode: "create" | "edit";
}

export function ProductForm({ initial, categories, suppliers, mode }: ProductFormProps) {
  const router = useRouter();
  const { addToast } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [form, setForm] = useState<ProductFormData>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    brand: initial?.brand ?? "",
    supplier_sku: initial?.supplier_sku ?? "",
    cost_price: initial?.cost_price ?? "",
    price: initial?.price ?? "",
    member_price: initial?.member_price ?? "",
    compare_at_price: initial?.compare_at_price ?? "",
    stock_quantity: initial?.stock_quantity ?? "0",
    stock_status: initial?.stock_status ?? "in_stock",
    gender: initial?.gender ?? "women",
    category_id: initial?.category_id ?? "",
    supplier_id: initial?.supplier_id ?? "",
    primary_image_url: initial?.primary_image_url ?? "",
    is_active: initial?.is_active ?? false,
    is_featured: initial?.is_featured ?? false,
    tags: initial?.tags ?? "",
  });

  const set = (key: keyof ProductFormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleNameBlur = () => {
    if (!form.slug && form.name) {
      set("slug", slugify(form.name, { lower: true, strict: true }));
    }
  };

  const handleAiEnhance = async () => {
    if (!form.name) {
      addToast({ message: "Introduce el nombre del producto primero", type: "error" });
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/enhance-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          brand: form.brand,
          existing_description: form.description,
        }),
      });
      const data = await res.json() as { description?: string; error?: string };
      if (data.description) {
        set("description", data.description);
        addToast({ message: "Descripción mejorada con IA", type: "success" });
      } else {
        addToast({ message: data.error ?? "Error al generar descripción", type: "error" });
      }
    } catch {
      addToast({ message: "Error de conexión", type: "error" });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.price) {
      addToast({ message: "Nombre, slug y precio son obligatorios", type: "error" });
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      brand: form.brand || null,
      supplier_sku: form.supplier_sku || null,
      cost_price: form.cost_price ? parseFloat(form.cost_price) : null,
      price: parseFloat(form.price),
      member_price: form.member_price ? parseFloat(form.member_price) : null,
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      stock_status: form.stock_status,
      gender: form.gender,
      category_id: form.category_id || null,
      supplier_id: form.supplier_id || null,
      primary_image_url: form.primary_image_url || null,
      is_active: form.is_active,
      is_featured: form.is_featured,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      is_ai_enhanced: aiLoading ? true : undefined,
    };

    let error;
    if (mode === "edit" && initial?.id) {
      ({ error } = await supabase.from("products").update(payload).eq("id", initial.id));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }

    if (error) {
      addToast({ message: error.message, type: "error" });
    } else {
      addToast({
        message: mode === "edit" ? "Producto actualizado" : "Producto creado",
        type: "success",
      });
      router.push("/admin/productos");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic info */}
          <div className="bg-white rounded-card border border-border p-6 space-y-4">
            <h2 className="font-medium text-[14px] pb-2 border-b border-border">Información básica</h2>

            <Input
              label="Nombre del producto *"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              onBlur={handleNameBlur}
              placeholder="Bolso de piel genuina Milano"
              required
            />
            <Input
              label="Slug (URL)"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="bolso-piel-genuina-milano"
              hint="Se genera automáticamente desde el nombre"
            />

            {/* Description + AI */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[12px] uppercase tracking-wider text-text-secondary">
                  Descripción
                </label>
                <button
                  type="button"
                  onClick={handleAiEnhance}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 text-[11px] text-primary hover:text-primary-hover transition-colors disabled:opacity-50"
                >
                  {aiLoading
                    ? <Loader2 size={12} className="animate-spin" />
                    : <Sparkles size={12} strokeWidth={1.5} />
                  }
                  Mejorar con IA
                </button>
              </div>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={5}
                placeholder="Descripción del producto..."
                className="input-base resize-y"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Marca"
                value={form.brand}
                onChange={(e) => set("brand", e.target.value)}
                placeholder="Milano"
              />
              <Input
                label="SKU proveedor"
                value={form.supplier_sku}
                onChange={(e) => set("supplier_sku", e.target.value)}
                placeholder="PROV-001"
              />
            </div>

            <Input
              label="URL imagen principal"
              value={form.primary_image_url}
              onChange={(e) => set("primary_image_url", e.target.value)}
              placeholder="https://..."
            />
            {form.primary_image_url && (
              <div className="w-24 h-24 rounded-lg overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.primary_image_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <Input
              label="Tags (separadas por coma)"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="bolso, piel, oferta"
            />
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-card border border-border p-6 space-y-4">
            <h2 className="font-medium text-[14px] pb-2 border-b border-border">Precios</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Precio coste (€)"
                type="number"
                step="0.01"
                value={form.cost_price}
                onChange={(e) => set("cost_price", e.target.value)}
                placeholder="0.00"
              />
              <Input
                label="Precio de venta (€) *"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="0.00"
                required
              />
              <Input
                label="Precio miembro (€)"
                type="number"
                step="0.01"
                value={form.member_price}
                onChange={(e) => set("member_price", e.target.value)}
                placeholder="0.00"
              />
              <Input
                label="Precio tachado (€)"
                type="number"
                step="0.01"
                value={form.compare_at_price}
                onChange={(e) => set("compare_at_price", e.target.value)}
                placeholder="0.00"
              />
            </div>
            {form.cost_price && form.price && (
              <p className="text-[12px] text-text-muted">
                Margen:{" "}
                <span className="text-success font-medium">
                  {(((parseFloat(form.price) - parseFloat(form.cost_price)) / parseFloat(form.price)) * 100).toFixed(1)}%
                </span>
              </p>
            )}
          </div>

          {/* Stock */}
          <div className="bg-white rounded-card border border-border p-6 space-y-4">
            <h2 className="font-medium text-[14px] pb-2 border-b border-border">Inventario</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Cantidad en stock"
                type="number"
                value={form.stock_quantity}
                onChange={(e) => set("stock_quantity", e.target.value)}
                placeholder="0"
              />
              <div className="space-y-1.5">
                <label className="block text-[12px] uppercase tracking-wider text-text-secondary">Estado de stock</label>
                <select
                  value={form.stock_status}
                  onChange={(e) => set("stock_status", e.target.value)}
                  className="input-base"
                >
                  <option value="in_stock">En stock</option>
                  <option value="low_stock">Stock bajo</option>
                  <option value="out_of_stock">Agotado</option>
                  <option value="discontinued">Descontinuado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Side column */}
        <div className="space-y-5">
          {/* Visibility */}
          <div className="bg-white rounded-card border border-border p-6 space-y-4">
            <h2 className="font-medium text-[14px] pb-2 border-b border-border">Visibilidad</h2>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[13px] text-text-secondary">Activo (visible en tienda)</span>
              <button
                type="button"
                onClick={() => set("is_active", !form.is_active)}
                className={`relative w-10 h-6 rounded-full transition-all ${
                  form.is_active ? "bg-primary" : "bg-border"
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  form.is_active ? "left-5" : "left-1"
                }`} />
              </button>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[13px] text-text-secondary">Destacado en home</span>
              <button
                type="button"
                onClick={() => set("is_featured", !form.is_featured)}
                className={`relative w-10 h-6 rounded-full transition-all ${
                  form.is_featured ? "bg-gold" : "bg-border"
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  form.is_featured ? "left-5" : "left-1"
                }`} />
              </button>
            </label>
          </div>

          {/* Organization */}
          <div className="bg-white rounded-card border border-border p-6 space-y-4">
            <h2 className="font-medium text-[14px] pb-2 border-b border-border">Organización</h2>

            <div className="space-y-1.5">
              <label className="block text-[12px] uppercase tracking-wider text-text-secondary">Categoría</label>
              <select
                value={form.category_id}
                onChange={(e) => set("category_id", e.target.value)}
                className="input-base"
              >
                <option value="">Sin categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[12px] uppercase tracking-wider text-text-secondary">Proveedor</label>
              <select
                value={form.supplier_id}
                onChange={(e) => set("supplier_id", e.target.value)}
                className="input-base"
              >
                <option value="">Sin proveedor</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[12px] uppercase tracking-wider text-text-secondary">Género</label>
              <select
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
                className="input-base"
              >
                <option value="women">Mujer</option>
                <option value="men">Hombre</option>
                <option value="unisex">Unisex</option>
                <option value="kids">Niños</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button type="submit" variant="primary" loading={loading} className="w-full">
              {mode === "edit" ? "Guardar cambios" : "Crear producto"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
