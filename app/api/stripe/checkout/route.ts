import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateStripeCustomer } from "@/lib/stripe/helpers";
import type { CheckoutLineItem } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { items: CheckoutLineItem[]; coupon?: string };
    const { items } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "No hay productos en el carrito" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let customerId: string | undefined;
    let isMember = false;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_customer_id, membership_status")
        .eq("id", user.id)
        .single();

      customerId = await getOrCreateStripeCustomer(user.id, user.email!, profile?.stripe_customer_id ?? undefined);
      isMember = profile?.membership_status === "active";
    }

    // Fetch products to get current prices
    const productIds = items.map((i) => i.product_id);
    const { data: products } = await supabase
      .from("products")
      .select("id, name, price, member_price, slug")
      .in("id", productIds);

    const lineItems = items.map((item) => {
      const product = products?.find((p) => p.id === item.product_id);
      if (!product) throw new Error(`Producto ${item.product_id} no encontrado`);

      const unitPrice = isMember && product.member_price
        ? Math.round(product.member_price * 100)
        : Math.round(product.price * 100);

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            metadata: { product_id: product.id },
          },
          unit_amount: unitPrice,
        },
        quantity: item.quantity,
      };
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      customer_creation: customerId ? undefined : "always",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["ES", "PT", "FR", "DE", "IT"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "eur" },
            display_name: "Envío gratuito",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 499, currency: "eur" },
            display_name: "Envío estándar",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 10 },
            },
          },
        },
      ],
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/carrito`,
      metadata: { user_id: user?.id ?? "" },
      locale: "es",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al crear sesión de pago" },
      { status: 500 }
    );
  }
}
