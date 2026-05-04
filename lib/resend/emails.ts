import { resend, FROM_EMAIL, ADMIN_EMAIL } from "./client";
import { render } from "@react-email/render";
import { WelcomeEmail } from "./templates/WelcomeEmail";
import { OrderConfirmation } from "./templates/OrderConfirmation";
import { ShippingUpdate } from "./templates/ShippingUpdate";
import { PasswordReset } from "./templates/PasswordReset";

export async function sendWelcomeEmail(to: string, name?: string) {
  const html = await render(WelcomeEmail({ email: to, name }));
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Bienvenida a ModasClub ✨",
    html,
  });
}

export async function sendOrderConfirmation(
  to: string,
  data: {
    orderNumber: string;
    customerName?: string;
    items: { name: string; quantity: number; unit_price: number }[];
    subtotal: number;
    shippingAmount: number;
    total: number;
    shippingAddress?: {
      full_name?: string;
      line1?: string;
      city?: string;
      postal_code?: string;
      country?: string;
    };
  }
) {
  const html = await render(OrderConfirmation(data));
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Pedido confirmado · ${data.orderNumber}`,
    html,
  });
}

export async function sendShippingUpdate(
  to: string,
  data: {
    orderNumber: string;
    customerName?: string;
    trackingNumber?: string;
    carrier?: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
  }
) {
  const html = await render(ShippingUpdate(data));
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Tu pedido ${data.orderNumber} está en camino 📦`,
    html,
  });
}

export async function sendPasswordReset(to: string, resetUrl: string) {
  const html = await render(PasswordReset({ resetUrl }));
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Restablecer contraseña · ModasClub",
    html,
  });
}
