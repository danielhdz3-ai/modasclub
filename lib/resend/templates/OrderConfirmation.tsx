import {
  Html, Head, Body, Container, Section, Text, Link, Hr, Row, Column,
} from "@react-email/components";

interface OrderItem {
  name: string;
  quantity: number;
  unit_price: number;
}

interface OrderConfirmationProps {
  orderNumber: string;
  customerName?: string;
  items: OrderItem[];
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

const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

export function OrderConfirmation({
  orderNumber,
  customerName,
  items,
  subtotal,
  shippingAmount,
  total,
  shippingAddress,
}: OrderConfirmationProps) {
  return (
    <Html lang="es">
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>ModasClub</Text>
          </Section>

          <Section style={content}>
            <Text style={title}>¡Pedido confirmado!</Text>
            <Text style={paragraph}>
              Hola{customerName ? `, ${customerName.split(" ")[0]}` : ""}. Hemos recibido tu pedido{" "}
              <strong>{orderNumber}</strong> y está siendo procesado.
            </Text>

            {/* Items */}
            <Section style={tableHeader}>
              <Row>
                <Column style={colProduct}>Producto</Column>
                <Column style={colQty}>Cantidad</Column>
                <Column style={colPrice}>Precio</Column>
              </Row>
            </Section>

            {items.map((item, i) => (
              <Section key={i} style={tableRow}>
                <Row>
                  <Column style={colProduct}>{item.name}</Column>
                  <Column style={colQty}>{item.quantity}</Column>
                  <Column style={colPrice}>{fmt(item.unit_price * item.quantity)}</Column>
                </Row>
              </Section>
            ))}

            <Hr style={hr} />

            {/* Totals */}
            <Section>
              <Row>
                <Column><Text style={totalLabel}>Subtotal</Text></Column>
                <Column><Text style={totalValue}>{fmt(subtotal)}</Text></Column>
              </Row>
              <Row>
                <Column><Text style={totalLabel}>Envío</Text></Column>
                <Column><Text style={totalValue}>{shippingAmount === 0 ? "Gratis" : fmt(shippingAmount)}</Text></Column>
              </Row>
              <Row>
                <Column><Text style={{ ...totalLabel, fontWeight: "600", color: "#2C2C2C" }}>Total</Text></Column>
                <Column><Text style={{ ...totalValue, fontWeight: "600", color: "#2C2C2C", fontSize: "18px", fontStyle: "italic" }}>{fmt(total)}</Text></Column>
              </Row>
            </Section>

            {/* Shipping address */}
            {shippingAddress && (
              <>
                <Hr style={hr} />
                <Text style={sectionTitle}>Dirección de envío</Text>
                <Text style={addressText}>
                  {shippingAddress.full_name}<br />
                  {shippingAddress.line1}<br />
                  {shippingAddress.postal_code} {shippingAddress.city}<br />
                  {shippingAddress.country}
                </Text>
              </>
            )}

            <Hr style={hr} />
            <Text style={paragraph}>
              Recibirás otro email cuando tu pedido sea enviado con el número de seguimiento.
            </Text>
            <Link href="https://modasclub.com/cuenta/pedidos" style={button}>
              Ver mi pedido
            </Link>

            <Hr style={hr} />
            <Text style={footer}>
              © ModasClub · <Link href="https://modasclub.com" style={link}>modasclub.com</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: "#FDF8F8", fontFamily: "Georgia, serif" };
const container = { maxWidth: "580px", margin: "0 auto", padding: "40px 20px" };
const header = { textAlign: "center" as const, marginBottom: "32px" };
const logo = { fontSize: "28px", fontStyle: "italic", color: "#C97B8A", margin: 0 };
const content = { backgroundColor: "#FFFFFF", borderRadius: "12px", padding: "40px", border: "1px solid #F0E0E3" };
const title = { fontSize: "24px", fontStyle: "italic", color: "#2C2C2C", marginBottom: "16px" };
const paragraph = { fontSize: "14px", color: "#6B6B6B", lineHeight: "1.7", fontFamily: "Helvetica, sans-serif", margin: "0 0 16px" };
const tableHeader = { borderBottom: "1px solid #F0E0E3", paddingBottom: "8px", marginBottom: "4px" };
const tableRow = { borderBottom: "1px solid #F5F5F5", padding: "8px 0" };
const colProduct = { fontSize: "13px", fontFamily: "Helvetica, sans-serif", color: "#2C2C2C", width: "60%" };
const colQty = { fontSize: "13px", fontFamily: "Helvetica, sans-serif", color: "#6B6B6B", width: "15%", textAlign: "center" as const };
const colPrice = { fontSize: "13px", fontFamily: "Helvetica, sans-serif", color: "#2C2C2C", width: "25%", textAlign: "right" as const };
const totalLabel = { fontSize: "13px", color: "#6B6B6B", fontFamily: "Helvetica, sans-serif", margin: "4px 0" };
const totalValue = { fontSize: "13px", color: "#6B6B6B", fontFamily: "Helvetica, sans-serif", textAlign: "right" as const, margin: "4px 0" };
const sectionTitle = { fontSize: "12px", textTransform: "uppercase" as const, letterSpacing: "1px", color: "#AAAAAA", fontFamily: "Helvetica, sans-serif", margin: "0 0 8px" };
const addressText = { fontSize: "13px", color: "#2C2C2C", fontFamily: "Helvetica, sans-serif", lineHeight: "1.6" };
const button = { display: "inline-block", backgroundColor: "#E8A0A8", color: "#FFFFFF", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", fontSize: "14px", fontFamily: "Helvetica, sans-serif", fontWeight: "500" };
const hr = { borderColor: "#F0E0E3", margin: "24px 0" };
const footer = { fontSize: "12px", color: "#AAAAAA", fontFamily: "Helvetica, sans-serif", textAlign: "center" as const };
const link = { color: "#E8A0A8" };
