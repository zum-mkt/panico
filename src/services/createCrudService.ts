import { supabase } from "@/supabase/client";

/**
 * Fábrica de serviços CRUD reutilizável — toda chamada ao Supabase deve
 * passar por um service gerado aqui, nunca direto de componentes visuais.
 * Ver 01-ARQUITETURA_DO_PROJETO.md > Regras.
 */
export function createCrudService<T extends { id: string }>(table: string) {
  return {
    async list(): Promise<T[]> {
      const { data, error } = await supabase.from(table).select("*");
      if (error) throw error;
      return data as T[];
    },

    async getById(id: string): Promise<T> {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as T;
    },

    async create(payload: Partial<T>): Promise<T> {
      const { data, error } = await supabase
        .from(table)
        .insert(payload as never)
        .select()
        .single();
      if (error) throw error;
      return data as T;
    },

    async update(id: string, payload: Partial<T>): Promise<T> {
      const { data, error } = await supabase
        .from(table)
        .update(payload as never)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as T;
    },

    async remove(id: string): Promise<void> {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
  };
}
