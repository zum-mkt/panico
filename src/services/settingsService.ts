import { supabase } from "@/supabase/client";
import { compressToWebp } from "@/lib/imageProcessing";

export async function upsertSetting<T>(key: string, value: T) {
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value }, { onConflict: "key" });
  if (error) throw error;
}

export async function uploadSiteAsset(file: File): Promise<string> {
  const processed = await compressToWebp(file);
  const path = `${crypto.randomUUID()}-${processed.name}`;
  const { error } = await supabase.storage.from("gallery").upload(path, processed);
  if (error) throw error;
  const { data } = supabase.storage.from("gallery").getPublicUrl(path);
  return data.publicUrl;
}
