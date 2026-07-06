import { supabase } from "@/supabase/client";
import { createCrudService } from "@/services/createCrudService";
import { compressToWebp } from "@/lib/imageProcessing";
import type { Media } from "@/types/media";

export const mediaCrud = createCrudService<Media>("media");

export async function listAllMedia(): Promise<Media[]> {
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function listFolders(): Promise<string[]> {
  const { data, error } = await supabase.from("media").select("folder");
  if (error) throw error;
  return Array.from(new Set(data.map((m) => m.folder).filter((f): f is string => !!f)));
}

export async function uploadMedia(file: File, folder: string | null): Promise<Media> {
  const processed = await compressToWebp(file);
  const path = folder
    ? `${folder}/${crypto.randomUUID()}-${processed.name}`
    : `${crypto.randomUUID()}-${processed.name}`;

  const { error: uploadError } = await supabase.storage.from("gallery").upload(path, processed);
  if (uploadError) throw uploadError;

  const { data: publicUrl } = supabase.storage.from("gallery").getPublicUrl(path);

  const { data, error } = await supabase
    .from("media")
    .insert({ bucket: "gallery", path, url: publicUrl.publicUrl, folder })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMedia(media: Media) {
  await supabase.storage.from(media.bucket).remove([media.path]);
  const { error } = await supabase.from("media").delete().eq("id", media.id);
  if (error) throw error;
}
