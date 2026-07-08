import { useQuery } from "@tanstack/react-query";
import { getSetting } from "@/services/homeService";
import type { SeoPageEntry, SeoPageKey, SeoPagesSettings } from "@/types/seo";

// Título/descrição das páginas estáticas, editável em /admin/seo — ver
// 12-SEO_E_MARKETING.md. Cai no fallback do próprio código enquanto a
// settings não carrega ou não tem a chave preenchida.
export function useSeoPage(key: SeoPageKey, fallback: SeoPageEntry): SeoPageEntry {
  const { data } = useQuery({
    queryKey: ["settings", "seo_pages"],
    queryFn: () => getSetting<SeoPagesSettings>("seo_pages"),
  });
  const entry = data?.[key];
  return {
    title: entry?.title || fallback.title,
    description: entry?.description || fallback.description,
  };
}
