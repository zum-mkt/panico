import { supabase } from "@/supabase/client";
import { createCrudService } from "@/services/createCrudService";
import { compressToWebp } from "@/lib/imageProcessing";
import type { Crown } from "@/types/crown";

export const crownsCrud = createCrudService<Crown>("crowns");

export async function listPublicCrowns(): Promise<Crown[]> {
  const { data, error } = await supabase
    .from("crowns")
    .select("*")
    .eq("is_active", true)
    .order("position");
  if (error) throw error;
  return data;
}

export async function listAllCrownsAdmin(): Promise<Crown[]> {
  const { data, error } = await supabase.from("crowns").select("*").order("position");
  if (error) throw error;
  return data;
}

export async function uploadCrownPhoto(file: File): Promise<string> {
  const processed = await compressToWebp(file);
  const path = `${crypto.randomUUID()}-${processed.name}`;
  const { error } = await supabase.storage.from("crowns").upload(path, processed);
  if (error) throw error;
  const { data } = supabase.storage.from("crowns").getPublicUrl(path);
  return data.publicUrl;
}
