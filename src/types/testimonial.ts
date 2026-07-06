export type Testimonial = {
  id: string;
  author_name: string;
  author_photo_url: string | null;
  content: string;
  rating: number | null;
  position: number;
  is_active: boolean;
  created_at: string;
};
