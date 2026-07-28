import { supabase } from "@/supabase/client";
import { createCrudService } from "@/services/createCrudService";
import { compressToWebp } from "@/lib/imageProcessing";
import type { Service } from "@/types/service";

export const servicesCrud = createCrudService<Service>("services");

export async function listAllServicesAdmin(): Promise<Service[]> {
  const { data, error } = await supabase.from("services").select("*").order("position");
  if (error) throw error;
  return data;
}

export async function uploadServiceImage(file: File): Promise<string> {
  const processed = await compressToWebp(file);
  const path = `${crypto.randomUUID()}-${processed.name}`;
  const { error } = await supabase.storage.from("services").upload(path, processed);
  if (error) throw error;
  const { data } = supabase.storage.from("services").getPublicUrl(path);
  return data.publicUrl;
}
