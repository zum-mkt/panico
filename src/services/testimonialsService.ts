import { supabase } from "@/supabase/client";
import { createCrudService } from "@/services/createCrudService";
import { compressToWebp } from "@/lib/imageProcessing";
import type { Testimonial } from "@/types/testimonial";

export const testimonialsCrud = createCrudService<Testimonial>("testimonials");

export async function listAllTestimonialsAdmin(): Promise<Testimonial[]> {
  const { data, error } = await supabase.from("testimonials").select("*").order("position");
  if (error) throw error;
  return data;
}

export async function uploadTestimonialPhoto(file: File): Promise<string> {
  const processed = await compressToWebp(file);
  const path = `${crypto.randomUUID()}-${processed.name}`;
  const { error } = await supabase.storage.from("gallery").upload(path, processed);
  if (error) throw error;
  const { data } = supabase.storage.from("gallery").getPublicUrl(path);
  return data.publicUrl;
}
