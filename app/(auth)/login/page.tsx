"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUIStore } from "@/store/uiStore";
import { loginSchema } from "@/lib/import/validators";

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse(form);
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
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      addToast({ message: "Email o contraseña incorrectos", type: "error" });
    } else {
      addToast({ message: "¡Bienvenida de vuelta!", type: "success" });
      router.push("/cuenta");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-card border border-border p-8 shadow-card">
      <h1 className="font-[family-name:var(--font-cormorant)] italic text-3xl text-text text-center mb-2">
        Bienvenida
      </h1>
      <p className="text-[13px] text-text-muted text-center mb-8">
        Inicia sesión en tu cuenta ModasClub
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="••••••••"
          required
        />

        <div className="flex justify-end">
          <Link href="/recuperar" className="text-[12px] text-text-muted hover:text-primary transition-colors">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
          Iniciar sesión
        </Button>
      </form>

      <p className="text-center text-[13px] text-text-muted mt-6">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="text-primary hover:text-primary-hover transition-colors font-medium">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
