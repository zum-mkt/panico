import { supabase } from "@/supabase/client";

export async function getSetting<T>(key: string): Promise<T | null> {
  const { data } = await supabase.from("settings").select("value").eq("key", key).single();
  return (data?.value as T) ?? null;
}

export async function listActiveServices() {
  const { data } = await supabase
    .from("services")
    .select("id, title, description, icon")
    .eq("is_active", true)
    .order("position");
  return data ?? [];
}

export async function listActivePlans() {
  const { data } = await supabase
    .from("plans")
    .select("id, title, description, price, benefits, is_featured")
    .eq("is_active", true)
    .order("position");
  return data ?? [];
}

export async function listRecentObituaries(limit = 3) {
  const { data } = await supabase
    .from("obituaries")
    .select(
      "id, name, photo_url, deceased_at, age, wake_location, wake_at, burial_location, burial_at",
    )
    .eq("status", "published")
    .order("deceased_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function listActiveTestimonials() {
  const { data } = await supabase
    .from("testimonials")
    .select("id, author_name, author_photo_url, content, rating")
    .eq("is_active", true)
    .order("position");
  return data ?? [];
}

export async function listHomeFaq() {
  const { data } = await supabase
    .from("faq")
    .select("id, question, answer")
    .eq("is_active", true)
    .eq("context", "home")
    .order("position");
  return data ?? [];
}

export async function listActivePartners() {
  const { data } = await supabase
    .from("partners")
    .select("id, name, logo_url, link_url")
    .eq("is_active", true)
    .order("position");
  return data ?? [];
}
