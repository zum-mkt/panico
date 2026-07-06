export type Banner = {
  id: string;
  title: string | null;
  image_desktop_url: string | null;
  image_tablet_url: string | null;
  image_mobile_url: string | null;
  link_url: string | null;
  cta_label: string | null;
  position: number;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
};
