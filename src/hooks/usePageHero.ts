import { useQuery } from "@tanstack/react-query";
import { getSetting } from "@/services/homeService";

export type PageHeroContent = {
  eyebrow?: string;
  title?: string;
  description?: string;
  image_url?: string;
  primary_label?: string;
  primary_href?: string;
};

/** Hero de uma página interna, editável em /admin via chave de settings. */
export function usePageHero(settingsKey: string) {
  return useQuery({
    queryKey: ["settings", settingsKey],
    queryFn: () => getSetting<PageHeroContent>(settingsKey),
  });
}
