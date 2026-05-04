import type { Metadata } from "next";

export function buildMetadata({
  title,
  description,
  image,
  canonical,
}: {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
}): Metadata {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://modasclub.com";

  return {
    title,
    description,
    alternates: canonical
      ? { canonical: `${appUrl}${canonical}` }
      : undefined,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
      type: "website",
      locale: "es_ES",
      siteName: "ModasClub",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
