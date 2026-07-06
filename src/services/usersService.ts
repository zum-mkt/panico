import { supabase } from "@/supabase/client";
import type { StaffProfile } from "@/contexts/AuthContext";

export async function listStaff(): Promise<StaffProfile[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, avatar_url, is_active")
    .order("name");
  if (error) throw error;
  return data;
}

export async function updateStaffRole(
  id: string,
  patch: { role?: StaffProfile["role"]; is_active?: boolean },
) {
  const { error } = await supabase.from("users").update(patch).eq("id", id);
  if (error) throw error;
}
