import {
  Html, Head, Body, Container, Section, Text, Link, Hr, Img,
} from "@react-email/components";

interface WelcomeEmailProps {
  name?: string;
  email: string;
}

export function WelcomeEmail({ name, email }: WelcomeEmailProps) {
  const firstName = name?.split(" ")[0] ?? "bienvenida";

  return (
    <Html lang="es">
      <Head />
      <Body style={body}>
        <Container style={container}>
          {/* Logo */}
          <Section style={header}>
            <Text style={logo}>ModasClub</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Hola, {firstName} ✨</Text>
            <Text style={paragraph}>
              Bienvenida a ModasClub. Tu cuenta ha sido creada correctamente y
              ya puedes disfrutar de nuestra selección de bolsos, perfumes y relojes.
            </Text>
            <Text style={paragraph}>
              Si quieres acceder a precios exclusivos y ventajas adicionales,
              hazte miembro del Club por solo <strong>9,99€/mes</strong>.
            </Text>

            <Link href="https://modasclub.com/club" style={button}>
              Descubrir el Club
            </Link>

            <Hr style={hr} />
            <Text style={footer}>
              Si no has creado esta cuenta, ignora este email.
              <br />
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
const greeting = { fontSize: "22px", fontStyle: "italic", color: "#2C2C2C", marginBottom: "16px" };
const paragraph = { fontSize: "14px", color: "#6B6B6B", lineHeight: "1.7", fontFamily: "Helvetica, sans-serif", margin: "0 0 16px" };
const button = { display: "inline-block", backgroundColor: "#E8A0A8", color: "#FFFFFF", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", fontSize: "14px", fontFamily: "Helvetica, sans-serif", fontWeight: "500" };
const hr = { borderColor: "#F0E0E3", margin: "32px 0 16px" };
const footer = { fontSize: "12px", color: "#AAAAAA", fontFamily: "Helvetica, sans-serif", textAlign: "center" as const };
const link = { color: "#E8A0A8" };
