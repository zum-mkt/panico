import { supabase } from "@/supabase/client";
import { createCrudService } from "@/services/createCrudService";
import { compressToWebp } from "@/lib/imageProcessing";
import type { Plan } from "@/types/plan";

export const plansCrud = createCrudService<Plan>("plans");

export async function uploadPlanImage(file: File): Promise<string> {
  const processed = await compressToWebp(file);
  const path = `${crypto.randomUUID()}-${processed.name}`;
  const { error } = await supabase.storage.from("plans").upload(path, processed);
  if (error) throw error;
  const { data } = supabase.storage.from("plans").getPublicUrl(path);
  return data.publicUrl;
}

export async function listPublicPlans(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("is_active", true)
    .order("position");
  if (error) throw error;
  return data;
}

export async function listAllPlansAdmin(): Promise<Plan[]> {
  const { data, error } = await supabase.from("plans").select("*").order("position");
  if (error) throw error;
  return data;
}

export async function swapPlanPosition(a: Plan, b: Plan) {
  await Promise.all([
    plansCrud.update(a.id, { position: b.position }),
    plansCrud.update(b.id, { position: a.position }),
  ]);
}
