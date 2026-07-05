export type Plan = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  benefits: string[];
  is_featured: boolean;
  position: number;
  is_active: boolean;
  color: string | null;
  cta_label: string | null;
  cta_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
};
