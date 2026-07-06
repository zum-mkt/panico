import { supabase } from "@/supabase/client";
import { createCrudService } from "@/services/createCrudService";
import type { Service } from "@/types/service";

export const servicesCrud = createCrudService<Service>("services");

export async function listAllServicesAdmin(): Promise<Service[]> {
  const { data, error } = await supabase.from("services").select("*").order("position");
  if (error) throw error;
  return data;
}
