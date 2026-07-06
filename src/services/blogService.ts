import { supabase } from "@/supabase/client";
import { createCrudService } from "@/services/createCrudService";
import type { BlogPost } from "@/types/blogPost";

export const blogPostsCrud = createCrudService<BlogPost>("blog_posts");

export async function listPublishedPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data;
}

export async function listAllPostsAdmin(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function uploadBlogCover(file: File): Promise<string> {
  const path = `${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from("blog").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("blog").getPublicUrl(path);
  return data.publicUrl;
}

export function slugify(title: string) {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
