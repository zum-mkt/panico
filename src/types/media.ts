export type Media = {
  id: string;
  bucket: string;
  path: string;
  url: string;
  alt_text: string | null;
  tags: string[];
  folder: string | null;
  created_at: string;
};
