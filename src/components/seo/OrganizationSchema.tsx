import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { getSetting } from "@/services/homeService";

type SiteSettings = { phone?: string; address?: string };

/**
 * Schema.org da organização, injetado em toda página pública —
 * ver 12-SEO_E_MARKETING.md.
 */
export function OrganizationSchema() {
  const { data: site } = useQuery({
    queryKey: ["settings", "site"],
    queryFn: () => getSetting<SiteSettings>("site"),
  });

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FuneralHome",
          name: "Funerária Paníco",
          telephone: site?.phone,
          address: site?.address
            ? { "@type": "PostalAddress", streetAddress: site.address }
            : undefined,
          url: typeof window !== "undefined" ? window.location.origin : undefined,
        })}
      </script>
    </Helmet>
  );
}
