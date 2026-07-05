import { supabase } from "@/supabase/client";
import { createCrudService } from "@/services/createCrudService";
import type { Obituary, ObituaryMessage } from "@/types/obituary";

export const obituariesCrud = createCrudService<Obituary>("obituaries");

export async function listPublishedObituaries(): Promise<Obituary[]> {
  const { data, error } = await supabase
    .from("obituaries")
    .select("*")
    .eq("status", "published")
    .order("deceased_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function listAllObituariesAdmin(): Promise<Obituary[]> {
  const { data, error } = await supabase
    .from("obituaries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getObituaryById(id: string): Promise<Obituary | null> {
  const { data, error } = await supabase.from("obituaries").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function listApprovedMessages(obituaryId: string): Promise<ObituaryMessage[]> {
  const { data, error } = await supabase
    .from("obituary_messages")
    .select("*")
    .eq("obituary_id", obituaryId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function submitHomageMessage(
  obituaryId: string,
  authorName: string,
  message: string,
) {
  const { error } = await supabase
    .from("obituary_messages")
    .insert({ obituary_id: obituaryId, author_name: authorName, message });
  if (error) throw error;
}

export async function uploadObituaryPhoto(file: File): Promise<string> {
  const path = `${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from("obituaries").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("obituaries").getPublicUrl(path);
  return data.publicUrl;
}
