import { supabase } from "@/supabase/client";

async function count(table: string) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) return 0;
  return count ?? 0;
}

export async function getDashboardStats() {
  const [obituaries, plans, services, media] = await Promise.all([
    count("obituaries"),
    count("plans"),
    count("services"),
    count("media"),
  ]);
  return { obituaries, plans, services, media };
}

export async function getRecentObituaries(limit = 5) {
  const { data, error } = await supabase
    .from("obituaries")
    .select("id, name, deceased_at, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return data;
}

export async function getRecentMedia(limit = 5) {
  const { data, error } = await supabase
    .from("media")
    .select("id, url, alt_text, bucket, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return data;
}
