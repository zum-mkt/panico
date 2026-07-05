import { supabase } from "@/supabase/client";
import { createCrudService } from "@/services/createCrudService";
import type { Plan } from "@/types/plan";

export const plansCrud = createCrudService<Plan>("plans");

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
