import { supabase } from "@/supabase/client";
import { createCrudService } from "@/services/createCrudService";
import type { DynamicForm, FormSubmission } from "@/types/form";

export const formsCrud = createCrudService<DynamicForm>("forms");

export async function getFormBySlug(slug: string): Promise<DynamicForm | null> {
  const { data } = await supabase
    .from("forms")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return data;
}

export async function submitForm(formId: string, data: Record<string, string | boolean>) {
  const { error } = await supabase.from("form_submissions").insert({ form_id: formId, data });
  if (error) throw error;
}

export async function listAllFormsAdmin(): Promise<DynamicForm[]> {
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function listSubmissions(formId: string): Promise<FormSubmission[]> {
  const { data, error } = await supabase
    .from("form_submissions")
    .select("*")
    .eq("form_id", formId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export function submissionsToCsv(form: DynamicForm, submissions: FormSubmission[]): string {
  const headers = ["Data envio", ...form.fields.map((f) => f.label)];
  const rows = submissions.map((s) => [
    new Date(s.created_at).toLocaleString("pt-BR"),
    ...form.fields.map((f) => String(s.data[f.name] ?? "")),
  ]);
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
}
