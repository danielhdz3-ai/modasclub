"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUIStore } from "@/store/uiStore";

interface ProfileForm {
  full_name: string;
  phone: string;
}

export default function PerfilPage() {
  const [form, setForm] = useState<ProfileForm>({ full_name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { addToast } = useUIStore();

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("full_name, phone").eq("id", user.id).single();
        if (data) {
          setForm({ full_name: data.full_name ?? "", phone: data.phone ?? "" });
        }
      }
      setFetching(false);
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: form.full_name, phone: form.phone })
      .eq("id", user.id);

    if (error) {
      addToast({ message: "Error al guardar cambios", type: "error" });
    } else {
      addToast({ message: "Perfil actualizado correctamente", type: "success" });
    }
    setLoading(false);
  };

  if (fetching) return <div className="animate-pulse space-y-4"><div className="h-10 bg-surface-2 rounded-lg" /><div className="h-10 bg-surface-2 rounded-lg" /></div>;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-cormorant)] italic text-3xl text-text mb-6">
        Mi perfil
      </h1>

      <div className="bg-white rounded-card border border-border p-6 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre completo"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            placeholder="Tu nombre completo"
          />
          <Input
            label="Teléfono (opcional)"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+34 600 000 000"
          />
          <Button type="submit" variant="primary" loading={loading}>
            Guardar cambios
          </Button>
        </form>
      </div>
    </div>
  );
}
