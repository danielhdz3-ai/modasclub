import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Pinyon_Script } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ModasClub — Bolsos, Perfumes y Relojes",
    template: "%s | ModasClub",
  },
  description: "Descubre nuestra selección exclusiva de bolsos, perfumes y relojes de lujo. Precios exclusivos para socias del Club.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://modasclub.com"),
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "ModasClub",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jost.variable} ${pinyon.variable}`}>
      <body className="antialiased font-[family-name:var(--font-jost)]">

        {children}
      </body>
    </html>
  );
}
