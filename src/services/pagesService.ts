import { supabase } from "@/supabase/client";
import { createCrudService } from "@/services/createCrudService";
import { compressToWebp } from "@/lib/imageProcessing";
import type { BlockType, Page, PageSection } from "@/types/page";

export const pagesCrud = createCrudService<Page>("pages");
export const sectionsCrud = createCrudService<PageSection>("page_sections");

export async function getPublishedPageBySlug(
  slug: string,
): Promise<{ page: Page; sections: PageSection[] } | null> {
  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!page) return null;

  const { data: sections } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", page.id)
    .eq("is_active", true)
    .order("position");

  return { page, sections: sections ?? [] };
}

export async function listAllPagesAdmin(): Promise<Page[]> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function listSectionsAdmin(pageId: string): Promise<PageSection[]> {
  const { data, error } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", pageId)
    .order("position");
  if (error) throw error;
  return data;
}

export async function addSection(pageId: string, type: BlockType, afterPosition: number) {
  const { error } = await supabase
    .from("page_sections")
    .insert({ page_id: pageId, type, content: {}, position: afterPosition + 1 });
  if (error) throw error;
}

export async function duplicateSection(section: PageSection) {
  const { error } = await supabase.from("page_sections").insert({
    page_id: section.page_id,
    type: section.type,
    content: section.content,
    position: section.position + 1,
    is_active: section.is_active,
  });
  if (error) throw error;
}

export async function reorderSections(sections: PageSection[]) {
  await Promise.all(
    sections.map((s, i) => sectionsCrud.update(s.id, { position: i })),
  );
}

export async function uploadPageImage(file: File): Promise<string> {
  const processed = await compressToWebp(file);
  const path = `${crypto.randomUUID()}-${processed.name}`;
  const { error } = await supabase.storage.from("gallery").upload(path, processed);
  if (error) throw error;
  const { data } = supabase.storage.from("gallery").getPublicUrl(path);
  return data.publicUrl;
}
