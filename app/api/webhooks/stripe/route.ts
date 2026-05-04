import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateOrderNumber } from "@/lib/utils/formatters";
import { sendOrderConfirmation } from "@/lib/resend/emails";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature invalid: ${err instanceof Error ? err.message : "unknown"}` },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === "paid") {
          await handleCheckoutCompleted(session, supabase);
        }
        break;
      }
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await supabase
          .from("orders")
          .update({ payment_status: "paid" })
          .eq("stripe_payment_intent_id", pi.id);
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await supabase
          .from("orders")
          .update({ payment_status: "failed" })
          .eq("stripe_payment_intent_id", pi.id);
        break;
      }
      case "customer.subscription.created":
      case "invoice.payment_succeeded": {
        const subscription = event.data.object as Stripe.Subscription;
        await supabase
          .from("profiles")
          .update({
            membership_status: "active",
            membership_expires_at: new Date(
              (subscription as Stripe.Subscription).current_period_end * 1000
            ).toISOString(),
          })
          .eq("stripe_customer_id", (subscription as Stripe.Subscription).customer as string);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await supabase
          .from("profiles")
          .update({ membership_status: "cancelled" })
          .eq("stripe_customer_id", subscription.customer as string);
        break;
      }
    }
  } catch (err) {
    console.error(`Webhook handler error for ${event.type}:`, err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
) {
  const metadata = session.metadata ?? {};
  const userId = metadata["user_id"];
  const orderNumber = generateOrderNumber();

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
  });

  await supabase.from("orders").insert({
    user_id: userId ?? null,
    order_number: orderNumber,
    status: "confirmed",
    subtotal: (session.amount_subtotal ?? 0) / 100,
    total: (session.amount_total ?? 0) / 100,
    discount_amount: 0,
    shipping_amount: 0,
    tax_amount: 0,
    stripe_payment_intent_id: session.payment_intent as string,
    payment_status: "paid",
    shipping_address: session.shipping_details
      ? {
          full_name: session.shipping_details.name,
          line1: session.shipping_details.address?.line1 ?? "",
          line2: session.shipping_details.address?.line2 ?? "",
          city: session.shipping_details.address?.city ?? "",
          state: session.shipping_details.address?.state ?? "",
          postal_code: session.shipping_details.address?.postal_code ?? "",
          country: session.shipping_details.address?.country ?? "ES",
        }
      : {},
  });

  // Send confirmation email
  const customerEmail = session.customer_details?.email;
  if (customerEmail) {
    const emailItems = lineItems.data.map((li) => ({
      name: li.description ?? "Producto",
      quantity: li.quantity ?? 1,
      unit_price: (li.amount_total ?? 0) / 100 / (li.quantity ?? 1),
    }));
    await sendOrderConfirmation(customerEmail, {
      orderNumber,
      customerName: session.customer_details?.name ?? undefined,
      items: emailItems,
      subtotal: (session.amount_subtotal ?? 0) / 100,
      shippingAmount: 0,
      total: (session.amount_total ?? 0) / 100,
      shippingAddress: session.shipping_details
        ? {
            full_name: session.shipping_details.name ?? undefined,
            line1: session.shipping_details.address?.line1 ?? "",
            city: session.shipping_details.address?.city ?? "",
            postal_code: session.shipping_details.address?.postal_code ?? "",
            country: session.shipping_details.address?.country ?? "ES",
          }
        : undefined,
    }).catch((err) => console.error("Failed to send order email:", err));
  }
}
