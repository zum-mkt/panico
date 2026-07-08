export type SeoPageEntry = {
  title: string;
  description: string;
};

export const SEO_PAGE_KEYS = [
  "home",
  "planos",
  "coroas",
  "cemiterio",
  "obituarios",
  "blog",
  "contato",
] as const;

export type SeoPageKey = (typeof SEO_PAGE_KEYS)[number];

export type SeoPagesSettings = Partial<Record<SeoPageKey, SeoPageEntry>>;

export type SeoGlobalSettings = {
  default_image?: string;
};
