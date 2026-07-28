export type Service = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  content_html: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
};
