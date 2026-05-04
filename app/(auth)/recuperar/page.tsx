"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Introduce tu email"); return; }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/cuenta/perfil`,
    });
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-card border border-border p-8 shadow-card">
      <h1 className="font-[family-name:var(--font-cormorant)] italic text-3xl text-text text-center mb-2">
        Recuperar contraseña
      </h1>

      {sent ? (
        <div className="text-center mt-6">
          <p className="text-[14px] text-text-secondary font-light mb-6">
            Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
            Revisa tu bandeja de entrada.
          </p>
          <Link href="/login" className="text-[13px] text-primary hover:text-primary-hover">
            Volver al inicio de sesión
          </Link>
        </div>
      ) : (
        <>
          <p className="text-[13px] text-text-muted text-center mb-8 font-light">
            Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              error={error}
              placeholder="tu@email.com"
              required
            />
            <Button type="submit" variant="primary" loading={loading} className="w-full">
              Enviar enlace
            </Button>
          </form>

          <p className="text-center text-[13px] text-text-muted mt-6">
            <Link href="/login" className="text-primary hover:text-primary-hover transition-colors">
              ← Volver al login
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
