import { createClient } from "npm:@supabase/supabase-js@2";

/**
 * Client com service_role — ignora RLS. SUPABASE_URL e
 * SUPABASE_SERVICE_ROLE_KEY são injetados automaticamente pelo runtime em
 * toda Edge Function, não precisam ser configurados manualmente.
 */
export function createAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

/** Confere o segredo compartilhado com o trigger/cron do Postgres (ver
 * migration 20260818200000) — a chave anon já é pública no bundle do site,
 * então "exigir um JWT válido" não impediria terceiros de chamar a function. */
export function isAuthorizedWebhookCall(req: Request): boolean {
  const expected = Deno.env.get("WEBHOOK_SHARED_SECRET");
  if (!expected) return false;
  return req.headers.get("x-webhook-secret") === expected;
}
