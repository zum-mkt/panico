import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { getSetting } from "@/services/homeService";

type SiteSettings = { favicon_url?: string };

/**
 * Sobrescreve o favicon padrão quando configurado em
 * /admin/configuracoes — ver 18-CONFIGURACOES_GERAIS.md.
 */
export function DynamicFavicon() {
  const { data: site } = useQuery({
    queryKey: ["settings", "site"],
    queryFn: () => getSetting<SiteSettings>("site"),
  });

  if (!site?.favicon_url) return null;

  return (
    <Helmet>
      <link rel="icon" href={site.favicon_url} />
    </Helmet>
  );
}
