import { supabase } from "@/supabase/client";
import type { CemeteryContent, CemeterySection, CemeterySectionKey } from "@/types/cemetery";

export async function listActiveCemeterySections(): Promise<CemeterySection[]> {
  const { data, error } = await supabase
    .from("cemetery")
    .select("*")
    .eq("is_active", true)
    .order("position");
  if (error) throw error;
  return data;
}

export async function listAllCemeterySectionsAdmin(): Promise<CemeterySection[]> {
  const { data, error } = await supabase.from("cemetery").select("*").order("position");
  if (error) throw error;
  return data;
}

export async function upsertCemeterySection(
  section: CemeterySectionKey,
  content: CemeteryContent,
  is_active = true,
) {
  const { data: existing } = await supabase
    .from("cemetery")
    .select("id")
    .eq("section", section)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("cemetery")
      .update({ content, is_active })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("cemetery").insert({ section, content, is_active });
    if (error) throw error;
  }
}

export async function uploadCemeteryPhoto(file: File): Promise<string> {
  const path = `${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from("gallery").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("gallery").getPublicUrl(path);
  return data.publicUrl;
}

export async function listCemeteryFaq() {
  const { data, error } = await supabase
    .from("faq")
    .select("id, question, answer")
    .eq("is_active", true)
    .eq("context", "cemiterio")
    .order("position");
  if (error) throw error;
  return data;
}
