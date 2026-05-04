import {
  Html, Head, Body, Container, Section, Text, Link, Hr,
} from "@react-email/components";

interface PasswordResetProps {
  resetUrl: string;
  expiresIn?: string;
}

export function PasswordReset({ resetUrl, expiresIn = "1 hora" }: PasswordResetProps) {
  return (
    <Html lang="es">
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>ModasClub</Text>
          </Section>

          <Section style={content}>
            <Text style={title}>Restablece tu contraseña</Text>
            <Text style={paragraph}>
              Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
              Haz clic en el botón de abajo para crear una nueva contraseña.
            </Text>

            <Section style={{ textAlign: "center", margin: "32px 0" }}>
              <Link href={resetUrl} style={button}>
                Restablecer contraseña
              </Link>
            </Section>

            <Text style={small}>
              Este enlace expira en <strong>{expiresIn}</strong>. Si no solicitaste
              el cambio de contraseña, puedes ignorar este email de forma segura.
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
const title = { fontSize: "22px", fontStyle: "italic", color: "#2C2C2C", marginBottom: "16px" };
const paragraph = { fontSize: "14px", color: "#6B6B6B", lineHeight: "1.7", fontFamily: "Helvetica, sans-serif", margin: "0 0 16px" };
const small = { fontSize: "12px", color: "#AAAAAA", fontFamily: "Helvetica, sans-serif", lineHeight: "1.6" };
const button = { display: "inline-block", backgroundColor: "#E8A0A8", color: "#FFFFFF", padding: "14px 32px", borderRadius: "50px", textDecoration: "none", fontSize: "14px", fontFamily: "Helvetica, sans-serif", fontWeight: "500" };
const hr = { borderColor: "#F0E0E3", margin: "24px 0" };
const footer = { fontSize: "12px", color: "#AAAAAA", fontFamily: "Helvetica, sans-serif", textAlign: "center" as const };
const link = { color: "#E8A0A8" };
