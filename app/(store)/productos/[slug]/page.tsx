import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductGallery } from "@/components/store/ProductGallery";
import { PriceDisplay } from "@/components/store/PriceDisplay";
import { StockBadge } from "@/components/store/StockBadge";
import { ReviewStars } from "@/components/store/ReviewStars";
import { AddToCartButton } from "./AddToCartButton";
import { buildMetadata } from "@/lib/utils/seo";
import type { Product } from "@/types/database";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug), supplier:suppliers(id,name)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data as Product | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  const primaryImage = product.images?.find((i) => i.is_primary) ?? product.images?.[0];
  return buildMetadata({
    title: `${product.name} | ModasClub`,
    description: product.meta_description ?? product.short_description ?? undefined,
    image: primaryImage?.url,
    canonical: `/productos/${slug}`,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const images = product.images ?? [];

  // Structured data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description_ai ?? product.description ?? undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    image: images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EUR",
      availability:
        product.stock_status === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/productos/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="section-padding">
        <div className="content-max">
          {/* Breadcrumb */}
          <nav className="text-[12px] text-text-muted mb-8 flex items-center gap-2">
            <a href="/" className="hover:text-primary transition-colors">Inicio</a>
            <span>·</span>
            <a href="/productos" className="hover:text-primary transition-colors">Productos</a>
            {product.category && (
              <>
                <span>·</span>
                <a href={`/categoria/${product.category.slug}`} className="hover:text-primary transition-colors">
                  {product.category.name}
                </a>
              </>
            )}
            <span>·</span>
            <span className="text-text">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Gallery */}
            <ProductGallery images={images} productName={product.name} />

            {/* Info */}
            <div className="flex flex-col gap-6">
              {product.brand && (
                <p className="text-[11px] uppercase tracking-[0.15em] text-text-muted">
                  {product.brand}
                </p>
              )}

              <h1 className="font-[family-name:var(--font-cormorant)] italic text-4xl text-text font-light leading-tight">
                {product.name}
              </h1>

              <ReviewStars rating={4.5} showCount count={12} />

              <PriceDisplay
                price={product.price}
                memberPrice={product.member_price}
                compareAtPrice={product.compare_at_price}
                size="lg"
              />

              <StockBadge status={product.stock_status} quantity={product.stock_quantity} />

              {(product.description_ai ?? product.short_description ?? product.description) && (
                <p className="text-[14px] text-text-secondary font-light leading-relaxed">
                  {product.description_ai ?? product.short_description ?? product.description}
                </p>
              )}

              {/* Attributes */}
              {product.attributes && Object.keys(product.attributes).length > 0 && (
                <dl className="grid grid-cols-2 gap-2">
                  {Object.entries(product.attributes).map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[11px] uppercase tracking-wider text-text-muted">{k}</dt>
                      <dd className="text-[13px] text-text font-light">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <AddToCartButton product={product} />

              {/* Trust badges */}
              <div className="border-t border-border pt-4 flex flex-wrap gap-4">
                {[
                  "Envío gratis +50€",
                  "Devolución 30 días",
                  "Pago seguro",
                ].map((b) => (
                  <span key={b} className="text-[11px] uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description tabs */}
          <div className="mt-16 border-t border-border pt-12">
            <h2 className="font-[family-name:var(--font-cormorant)] italic text-3xl text-text font-light mb-6">
              Descripción detallada
            </h2>
            <div className="prose prose-sm text-text-secondary font-light max-w-2xl leading-relaxed">
              <p>{product.description ?? "Descripción no disponible."}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
