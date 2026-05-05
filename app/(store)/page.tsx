import { HeroSection } from "@/components/home/HeroSection";
import { EditorialStrip } from "@/components/home/EditorialStrip";
import { BoutiqueStory } from "@/components/home/BoutiqueStory";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ClubBanner } from "@/components/home/ClubBanner";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { buildMetadata } from "@/lib/utils/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "ModasClub — Bolsos, Perfumes y Relojes",
  description: "Descubre nuestra selección exclusiva de bolsos, perfumes y relojes. Precios exclusivos para socias del Club.",
  canonical: "/",
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <EditorialStrip />
      <BoutiqueStory />
      <CategoryGrid />
      <FeaturedProducts />
      <ClubBanner />
      <NewsletterSection />
    </>
  );
}
