"use client";

import { useState } from "react";
import { Mail, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUIStore } from "@/store/uiStore";
import { contactSchema } from "@/lib/import/validators";

export default function ContactoPage() {
  const { addToast } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.errors.forEach((err) => { if (err.path[0]) fe[err.path[0] as string] = err.message; });
      setErrors(fe);
      return;
    }
    setLoading(true);
    // Contact form submission — in production connect to Resend
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    addToast({ message: "Mensaje enviado. Te responderemos pronto.", type: "success" });
    setLoading(false);
  };

  return (
    <div className="content-max section-padding">
      <div className="text-center mb-12">
        <h1 className="font-[family-name:var(--font-cormorant)] italic text-5xl text-text mb-3">
          Contacto
        </h1>
        <p className="text-[15px] text-text-muted font-light">
          Estamos aquí para ayudarte con cualquier pregunta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        {/* Info */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-pill bg-primary-pale flex items-center justify-center flex-shrink-0">
              <Mail size={16} strokeWidth={1.5} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-[14px] text-text mb-1">Email</h3>
              <p className="text-[13px] text-text-muted font-light">info@modasclub.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-pill bg-primary-pale flex items-center justify-center flex-shrink-0">
              <MessageCircle size={16} strokeWidth={1.5} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-[14px] text-text mb-1">Chat en vivo</h3>
              <p className="text-[13px] text-text-muted font-light">
                Disponible en la web durante horario de atención
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-pill bg-primary-pale flex items-center justify-center flex-shrink-0">
              <Clock size={16} strokeWidth={1.5} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-[14px] text-text mb-1">Horario de atención</h3>
              <p className="text-[13px] text-text-muted font-light">
                Lunes a Viernes: 9:00 – 19:00<br />
                Respondemos en menos de 24 horas
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        {sent ? (
          <div className="bg-success/10 border border-success/20 rounded-card p-8 text-center">
            <p className="font-[family-name:var(--font-cormorant)] italic text-3xl text-text mb-3">
              ¡Mensaje enviado!
            </p>
            <p className="text-[13px] text-text-muted font-light">
              Te responderemos en menos de 24 horas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-card border border-border p-6 space-y-4">
            <Input
              label="Tu nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
              placeholder="María García"
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
              label="Asunto"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              error={errors.subject}
              placeholder="Pregunta sobre mi pedido"
              required
            />
            <div className="space-y-1">
              <label className="block text-[12px] uppercase tracking-wider text-text-secondary">
                Mensaje
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                placeholder="Cuéntanos cómo podemos ayudarte..."
                className="input-base resize-none"
                required
              />
              {errors.message && <p className="text-[12px] text-error">{errors.message}</p>}
            </div>
            <Button type="submit" variant="primary" loading={loading} className="w-full">
              Enviar mensaje
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
