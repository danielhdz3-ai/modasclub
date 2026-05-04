import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, Package } from "lucide-react";
import { stripe } from "@/lib/stripe/client";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  let orderTotal = "";
  let customerEmail = "";

  if (params.session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(params.session_id);
      orderTotal = session.amount_total ? `${(session.amount_total / 100).toFixed(2).replace(".", ",")}€` : "";
      customerEmail = session.customer_details?.email ?? "";
    } catch {
      // Session not found — show generic success
    }
  }

  return (
    <div className="content-max section-padding text-center py-24 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={32} strokeWidth={1.5} className="text-success" />
      </div>

      <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text mb-3">
        ¡Pedido confirmado!
      </h1>

      <p className="text-[14px] text-text-secondary font-light mb-2">
        Gracias por tu compra en ModasClub.
        {customerEmail && ` Hemos enviado la confirmación a ${customerEmail}.`}
      </p>

      {orderTotal && (
        <p className="font-[family-name:var(--font-cormorant)] italic text-3xl text-text mt-4 mb-8">
          Total: {orderTotal}
        </p>
      )}

      <div className="bg-surface-2 rounded-card p-5 mb-8 flex items-start gap-3 text-left">
        <Package size={18} strokeWidth={1.5} className="text-primary mt-0.5" />
        <div>
          <p className="text-[13px] font-medium text-text mb-1">¿Cuándo recibiré mi pedido?</p>
          <p className="text-[12px] text-text-muted font-light">
            El envío estándar tarda entre 5-10 días laborables.
            Recibirás un email con el número de seguimiento cuando tu pedido sea despachado.
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Link href="/cuenta/pedidos" className="btn-primary">
          Ver mis pedidos
        </Link>
        <Link href="/productos" className="btn-outline">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
