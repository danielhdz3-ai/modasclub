import { stripe } from "./client";
import type { ShippingAddress } from "@/types/database";

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  const existing = await stripe.customers.search({
    query: `metadata["supabase_user_id"]:"${userId}"`,
    limit: 1,
  });

  if (existing.data.length > 0) {
    return existing.data[0].id;
  }

  const customer = await stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: { supabase_user_id: userId },
  });

  return customer.id;
}

export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}

export function formatAmountFromStripe(amount: number): number {
  return amount / 100;
}

export function buildShippingFromAddress(address: ShippingAddress) {
  return {
    name: address.full_name,
    phone: address.phone,
    address: {
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
    },
  };
}
