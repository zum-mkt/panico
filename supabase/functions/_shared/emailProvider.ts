/**
 * Adaptador de envio de e-mail. Hoje fala com a API do Resend via fetch
 * (sem SDK — mais leve no Deno). Trocar de fornecedor no futuro é só
 * reescrever o corpo desta função; quem chama (`sendEmail`) não muda.
 *
 * Requer os secrets da Edge Function (nunca a tabela `settings`, que é
 * publicamente legível):
 *   RESEND_API_KEY  — chave de API do Resend
 *   EMAIL_FROM      — remetente, ex: "Funerária Paníco <avisos@seudominio.com.br>"
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM");
  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY/EMAIL_FROM não configurados nos secrets da function.");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend respondeu ${res.status}: ${body}`);
  }
}
