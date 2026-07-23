export type Obituary = {
  id: string;
  name: string;
  photo_url: string | null;
  deceased_at: string;
  spouse_name: string | null;
  children_names: string | null;
  wake_location: string | null;
  wake_at: string | null;
  wake_map_url: string | null;
  burial_location: string | null;
  burial_at: string | null;
  burial_map_url: string | null;
  message: string | null;
  status: "draft" | "published";
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
};

export type ObituaryMessage = {
  id: string;
  obituary_id: string;
  author_name: string;
  message: string;
  is_approved: boolean;
  created_at: string;
};
