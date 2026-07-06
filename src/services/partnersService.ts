import { supabase } from "@/supabase/client";
import { createCrudService } from "@/services/createCrudService";
import { compressToWebp } from "@/lib/imageProcessing";
import type { Partner } from "@/types/partner";

export const partnersCrud = createCrudService<Partner>("partners");

export async function listAllPartnersAdmin(): Promise<Partner[]> {
  const { data, error } = await supabase.from("partners").select("*").order("position");
  if (error) throw error;
  return data;
}

export async function uploadPartnerLogo(file: File): Promise<string> {
  const processed = await compressToWebp(file);
  const path = `${crypto.randomUUID()}-${processed.name}`;
  const { error } = await supabase.storage.from("partners").upload(path, processed);
  if (error) throw error;
  const { data } = supabase.storage.from("partners").getPublicUrl(path);
  return data.publicUrl;
}
