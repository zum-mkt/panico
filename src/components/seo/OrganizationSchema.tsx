import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { getSetting } from "@/services/homeService";

type SiteSettings = {
  phone?: string;
  address?: string;
  logo_url?: string;
  instagram?: string;
  facebook?: string;
};

/**
 * Schema.org da organização, injetado em toda página pública —
 * ver 12-SEO_E_MARKETING.md.
 */
export function OrganizationSchema() {
  const { data: site } = useQuery({
    queryKey: ["settings", "site"],
    queryFn: () => getSetting<SiteSettings>("site"),
  });

  const sameAs = [site?.instagram, site?.facebook].filter(Boolean);

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FuneralHome",
          name: "Funerária Paníco",
          telephone: site?.phone,
          logo: site?.logo_url,
          image: site?.logo_url,
          address: site?.address
            ? { "@type": "PostalAddress", streetAddress: site.address }
            : undefined,
          sameAs: sameAs.length ? sameAs : undefined,
          url: typeof window !== "undefined" ? window.location.origin : undefined,
        })}
      </script>
    </Helmet>
  );
}
