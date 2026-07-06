export type Page = {
  id: string;
  slug: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

export type BlockType =
  | "hero"
  | "text"
  | "image"
  | "cta"
  | "cards"
  | "faq"
  | "timeline"
  | "gallery"
  | "video"
  | "form";

export type PageSection = {
  id: string;
  page_id: string;
  type: BlockType;
  content: Record<string, unknown>;
  position: number;
  is_active: boolean;
};

export const blockTypeLabels: Record<BlockType, string> = {
  hero: "Hero",
  text: "Texto",
  image: "Imagem",
  cta: "CTA",
  cards: "Cards",
  faq: "FAQ",
  timeline: "Timeline",
  gallery: "Galeria",
  video: "Vídeo",
  form: "Formulário",
};
