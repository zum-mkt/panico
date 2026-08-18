import { createAdminClient, isAuthorizedWebhookCall } from "../_shared/supabaseAdmin.ts";
import { sendEmail } from "../_shared/emailProvider.ts";
import { renderEmail } from "../_shared/emailTemplate.ts";

// Disparada pelo trigger `notification_subscribers_send_confirmation`
// (ver migration 20260818200000) logo após um novo cadastro. Double
// opt-in: o inscrito só passa a receber avisos depois de clicar no link.
Deno.serve(async (req) => {
  if (!isAuthorizedWebhookCall(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { subscriber_id } = await req.json();
  if (!subscriber_id) {
    return new Response("subscriber_id é obrigatório", { status: 400 });
  }

  const admin = createAdminClient();
  const { data: subscriber, error } = await admin
    .from("notification_subscribers")
    .select("id, name, email, status, confirm_token")
    .eq("id", subscriber_id)
    .maybeSingle();

  if (error || !subscriber || subscriber.status !== "pending") {
    return new Response("ok", { status: 200 }); // nada a fazer, não é erro do chamador
  }

  const siteUrl = Deno.env.get("SITE_URL") ?? "";
  const confirmUrl = `${siteUrl}/confirmar-inscricao/${subscriber.confirm_token}`;

  const html = renderEmail({
    title: "Confirme sua inscrição",
    bodyHtml: `
      <p>Olá${subscriber.name ? `, ${escapeHtml(subscriber.name)}` : ""}.</p>
      <p>Recebemos seu pedido para ser avisado por e-mail sempre que um novo
      obituário for publicado no site da Funerária Paníco. Para confirmar,
      clique no botão abaixo.</p>
      <p>Se você não pediu esse cadastro, pode ignorar este e-mail — nada
      será ativado sem essa confirmação.</p>
    `,
    ctaLabel: "Confirmar inscrição",
    ctaUrl: confirmUrl,
    footerNote: "Você recebeu este e-mail porque alguém se inscreveu com este endereço no site da Funerária Paníco.",
  });

  try {
    await sendEmail(subscriber.email, "Confirme sua inscrição — Funerária Paníco", html);
  } catch (e) {
    console.error("Falha ao enviar e-mail de confirmação:", e);
    return new Response("Falha ao enviar e-mail", { status: 502 });
  }

  return new Response("ok", { status: 200 });
});

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
