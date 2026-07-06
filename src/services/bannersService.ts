import { supabase } from "@/supabase/client";
import { createCrudService } from "@/services/createCrudService";
import { compressToWebp } from "@/lib/imageProcessing";
import type { Banner } from "@/types/banner";

export const bannersCrud = createCrudService<Banner>("banners");

export async function listScheduledBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("position");
  if (error) throw error;
  const now = Date.now();
  return data.filter((b) => {
    if (b.starts_at && new Date(b.starts_at).getTime() > now) return false;
    if (b.ends_at && new Date(b.ends_at).getTime() < now) return false;
    return true;
  });
}

export async function listAllBannersAdmin(): Promise<Banner[]> {
  const { data, error } = await supabase.from("banners").select("*").order("position");
  if (error) throw error;
  return data;
}

export async function swapBannerPosition(a: Banner, b: Banner) {
  await Promise.all([
    bannersCrud.update(a.id, { position: b.position }),
    bannersCrud.update(b.id, { position: a.position }),
  ]);
}

export async function uploadBannerImage(file: File): Promise<string> {
  const processed = await compressToWebp(file);
  const path = `${crypto.randomUUID()}-${processed.name}`;
  const { error } = await supabase.storage.from("banners").upload(path, processed);
  if (error) throw error;
  const { data } = supabase.storage.from("banners").getPublicUrl(path);
  return data.publicUrl;
}
