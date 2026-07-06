import { supabase } from "@/supabase/client";
import { createCrudService } from "@/services/createCrudService";
import type { Faq } from "@/types/faq";

export const faqCrud = createCrudService<Faq>("faq");

export async function listFaqAdmin(context: string): Promise<Faq[]> {
  const { data, error } = await supabase
    .from("faq")
    .select("*")
    .eq("context", context)
    .order("position");
  if (error) throw error;
  return data;
}
