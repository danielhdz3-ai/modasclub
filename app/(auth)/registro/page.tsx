"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUIStore } from "@/store/uiStore";
import { registerSchema } from "@/lib/import/validators";

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: { full_name: parsed.data.full_name },
      },
    });

    if (error) {
      addToast({ message: error.message, type: "error" });
    } else {
      addToast({
        message: "¡Cuenta creada! Revisa tu email para confirmar.",
        type: "success",
        duration: 6000,
      });
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-card border border-border p-8 shadow-card">
      <h1 className="font-[family-name:var(--font-cormorant)] italic text-3xl text-text text-center mb-2">
        Únete al Club
      </h1>
      <p className="text-[13px] text-text-muted text-center mb-8">
        Crea tu cuenta ModasClub y empieza a disfrutar
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre completo"
          type="text"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          error={errors.full_name}
          placeholder="Tu nombre"
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          placeholder="tu@email.com"
          required
        />
        <Input
          label="Contraseña"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
          placeholder="Mínimo 8 caracteres"
          required
        />
        <Input
          label="Confirmar contraseña"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
          placeholder="Repite tu contraseña"
          required
        />

        <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
          Crear cuenta
        </Button>
      </form>

      <p className="text-center text-[13px] text-text-muted mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-primary hover:text-primary-hover transition-colors font-medium">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
