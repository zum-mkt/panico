import { Helmet } from "react-helmet-async";

/**
 * Meta tags padrão de SEO — ver 12-SEO_E_MARKETING.md.
 * Usar em toda página pública: título, descrição, canonical, Open
 * Graph e Twitter Card.
 */
export function Seo({
  title,
  description,
  image,
  type = "website",
}: {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
}) {
  const url = typeof window !== "undefined" ? window.location.href : undefined;
  const fullTitle = `${title} — Funerária Paníco`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {url && <link rel="canonical" href={url} />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content="Funerária Paníco" />

      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
