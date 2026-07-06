import { supabase } from "@/supabase/client";
import { createCrudService } from "@/services/createCrudService";
import type { Client, ClientDependent, ClientDocument, ClientHistoryEntry } from "@/types/client";

export const clientsCrud = createCrudService<Client>("clients");
export const dependentsCrud = createCrudService<ClientDependent>("client_dependents");

/**
 * Cria a conta de autenticação. Se o projeto exigir confirmação por
 * e-mail, ainda não há sessão neste momento — o perfil em
 * `public.clients` só pode ser criado depois, com o usuário já
 * autenticado (ver `createOwnClientProfile`), porque a policy de RLS
 * de insert exige auth.uid() = id.
 */
export async function signUpClient(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return { hasSession: !!data.session };
}

export async function createOwnClientProfile(userId: string, email: string, name: string) {
  const { error } = await supabase.from("clients").insert({ id: userId, name, email });
  if (error) throw error;
}

export async function getOwnClient(userId: string): Promise<Client | null> {
  const { data } = await supabase.from("clients").select("*").eq("id", userId).maybeSingle();
  return data;
}

export async function listOwnDependents(clientId: string): Promise<ClientDependent[]> {
  const { data, error } = await supabase
    .from("client_dependents")
    .select("*")
    .eq("client_id", clientId);
  if (error) throw error;
  return data;
}

export async function listOwnDocuments(clientId: string): Promise<ClientDocument[]> {
  const { data, error } = await supabase
    .from("client_documents")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function listOwnHistory(clientId: string): Promise<ClientHistoryEntry[]> {
  const { data, error } = await supabase
    .from("client_history")
    .select("*")
    .eq("client_id", clientId)
    .order("occurred_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getSignedDocumentUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("client-documents")
    .createSignedUrl(path, 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function listAllClientsAdmin(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function uploadClientDocument(clientId: string, file: File, title: string) {
  const path = `${clientId}/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from("client-documents").upload(path, file);
  if (error) throw error;
  const { error: insertError } = await supabase
    .from("client_documents")
    .insert({ client_id: clientId, title, file_url: path });
  if (insertError) throw insertError;
}

export async function addClientHistory(clientId: string, description: string) {
  const { error } = await supabase
    .from("client_history")
    .insert({ client_id: clientId, description });
  if (error) throw error;
}
