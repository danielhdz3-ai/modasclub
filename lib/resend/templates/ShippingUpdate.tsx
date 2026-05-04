import {
  Html, Head, Body, Container, Section, Text, Link, Hr,
} from "@react-email/components";

interface ShippingUpdateProps {
  orderNumber: string;
  customerName?: string;
  trackingNumber?: string;
  carrier?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
}

export function ShippingUpdate({
  orderNumber,
  customerName,
  trackingNumber,
  carrier,
  trackingUrl,
  estimatedDelivery,
}: ShippingUpdateProps) {
  return (
    <Html lang="es">
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>ModasClub</Text>
          </Section>

          <Section style={content}>
            {/* Icon */}
            <Text style={{ fontSize: "40px", textAlign: "center", margin: "0 0 16px" }}>📦</Text>

            <Text style={title}>¡Tu pedido está en camino!</Text>
            <Text style={paragraph}>
              Hola{customerName ? `, ${customerName.split(" ")[0]}` : ""}. Tu pedido{" "}
              <strong>{orderNumber}</strong> ha sido enviado y está en camino.
            </Text>

            {trackingNumber && (
              <Section style={trackingBox}>
                <Text style={trackingLabel}>Número de seguimiento</Text>
                <Text style={trackingNumber_style}>{trackingNumber}</Text>
                {carrier && <Text style={carrierText}>{carrier}</Text>}
                {estimatedDelivery && (
                  <Text style={deliveryText}>
                    Entrega estimada: <strong>{estimatedDelivery}</strong>
                  </Text>
                )}
              </Section>
            )}

            {trackingUrl && (
              <Link href={trackingUrl} style={button}>
                Rastrear mi pedido
              </Link>
            )}

            <Hr style={hr} />
            <Text style={paragraph}>
              Si tienes alguna pregunta sobre tu envío, no dudes en{" "}
              <Link href="https://modasclub.com/contacto" style={link}>contactarnos</Link>.
            </Text>

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
const title = { fontSize: "22px", fontStyle: "italic", color: "#2C2C2C", marginBottom: "16px", textAlign: "center" as const };
const paragraph = { fontSize: "14px", color: "#6B6B6B", lineHeight: "1.7", fontFamily: "Helvetica, sans-serif", margin: "0 0 16px" };
const trackingBox = { backgroundColor: "#FDF8F8", borderRadius: "12px", padding: "20px", border: "1px solid #F0E0E3", textAlign: "center" as const, margin: "24px 0" };
const trackingLabel = { fontSize: "11px", textTransform: "uppercase" as const, letterSpacing: "1px", color: "#AAAAAA", fontFamily: "Helvetica, sans-serif", margin: "0 0 8px" };
const trackingNumber_style = { fontSize: "20px", fontWeight: "600", color: "#2C2C2C", fontFamily: "Helvetica, sans-serif", margin: "0 0 4px" };
const carrierText = { fontSize: "13px", color: "#6B6B6B", fontFamily: "Helvetica, sans-serif", margin: "0 0 8px" };
const deliveryText = { fontSize: "13px", color: "#6B6B6B", fontFamily: "Helvetica, sans-serif", margin: 0 };
const button = { display: "inline-block", backgroundColor: "#E8A0A8", color: "#FFFFFF", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", fontSize: "14px", fontFamily: "Helvetica, sans-serif", fontWeight: "500" };
const hr = { borderColor: "#F0E0E3", margin: "24px 0" };
const footer = { fontSize: "12px", color: "#AAAAAA", fontFamily: "Helvetica, sans-serif", textAlign: "center" as const };
const link = { color: "#E8A0A8" };
