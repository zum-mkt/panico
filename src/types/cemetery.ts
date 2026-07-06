export type CemeterySectionKey =
  | "history"
  | "structure"
  | "gallery"
  | "video"
  | "drone"
  | "location"
  | "hours";

export type TextBlockContent = { title?: string; text?: string; image_url?: string };
export type GalleryContent = { images?: string[] };
export type VideoContent = { title?: string; youtube_url?: string };
export type LocationContent = { address?: string };
export type HoursContent = { schedule?: { day: string; hours: string }[] };

export type CemeteryContent =
  | TextBlockContent
  | GalleryContent
  | VideoContent
  | LocationContent
  | HoursContent;

export type CemeterySection = {
  id: string;
  section: CemeterySectionKey;
  content: CemeteryContent;
  position: number;
  is_active: boolean;
};
