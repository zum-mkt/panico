export type Crown = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  price: number | null;
  photos: string[];
  allow_custom_message: boolean;
  is_available: boolean;
  is_active: boolean;
  position: number;
  created_at: string;
};
