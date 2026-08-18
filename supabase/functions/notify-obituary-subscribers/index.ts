import { createAdminClient, isAuthorizedWebhookCall } from "../_shared/supabaseAdmin.ts";
import { sendEmail } from "../_shared/emailProvider.ts";
import { renderEmail } from "../_shared/emailTemplate.ts";

type Obituary = {
  id: string;
  name: string;
  deceased_at: string;
  wake_location: string | null;
  wake_at: string | null;
  burial_location: string | null;
  burial_at: string | null;
};

type Subscriber = { id: string; name: string; email: string; unsubscribe_token: string };

const BATCH_SIZE = 20;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });
const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" });

Deno.serve(async (req) => {
  if (!isAuthorizedWebhookCall(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const admin = createAdminClient();
  const body = await req.json().catch(() => ({}));
  const nowIso = new Date().toISOString();

  let obituaryIds: string[] = [];

  if (body.mode === "scan") {
    // Rede de segurança: obituários publicados/agendados que ainda não
    // foram notificados (cobre published_at agendado e falhas do trigger).
    const { data } = await admin
      .from("obituaries")
      .select("id")
      .eq("status", "published")
      .is("notified_at", null)
      .or(`published_at.is.null,published_at.lte.${nowIso}`)
      .limit(50);
    obituaryIds = (data ?? []).map((o) => o.id);
  } else if (body.obituary_id) {
    obituaryIds = [body.obituary_id];
  } else {
    return new Response("obituary_id ou mode=scan é obrigatório", { status: 400 });
  }

  const results = [];
  for (const id of obituaryIds) {
    results.push(await processObituary(admin, id, nowIso));
  }

  return new Response(JSON.stringify({ processed: results }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

async function processObituary(admin: ReturnType<typeof createAdminClient>, id: string, nowIso: string) {
  // Claim atômico: só segue quem conseguir marcar notified_at (garante que
  // nunca sai duplicado, mesmo se o trigger e a varredura do cron baterem
  // ao mesmo tempo para o mesmo obituário).
  const { data: obituary } = await admin
    .from("obituaries")
    .update({ notified_at: nowIso })
    .eq("id", id)
    .is("notified_at", null)
    .eq("status", "published")
    .or(`published_at.is.null,published_at.lte.${nowIso}`)
    .select("id, name, deceased_at, wake_location, wake_at, burial_location, burial_at")
    .maybeSingle();

  if (!obituary) {
    return { obituary_id: id, skipped: true };
  }

  const { data: subscribers } = await admin
    .from("notification_subscribers")
    .select("id, name, email, unsubscribe_token")
    .eq("status", "confirmed");

  const list = (subscribers ?? []) as Subscriber[];
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < list.length; i += BATCH_SIZE) {
    const batch = list.slice(i, i + BATCH_SIZE);
    const outcomes = await Promise.allSettled(
      batch.map((sub) => sendObituaryEmail(sub, obituary as Obituary)),
    );
    for (const outcome of outcomes) {
      if (outcome.status === "fulfilled") sent++;
      else {
        failed++;
        console.error("Falha ao notificar inscrito:", outcome.reason);
      }
    }
  }

  await admin.from("notification_runs").insert({
    obituary_id: obituary.id,
    sent_count: sent,
    failed_count: failed,
  });

  return { obituary_id: obituary.id, sent, failed };
}

async function sendObituaryEmail(subscriber: Subscriber, obituary: Obituary) {
  const siteUrl = Deno.env.get("SITE_URL") ?? "";
  const obituaryUrl = `${siteUrl}/obituarios/${obituary.id}`;
  const unsubscribeUrl = `${siteUrl}/desinscricao/${subscriber.unsubscribe_token}`;

  const details: string[] = [];
  if (obituary.wake_location) {
    details.push(
      `<p style="margin:12px 0 0;"><strong style="color:#16283D;">Velório:</strong><br/>${escapeHtml(obituary.wake_location)}${
        obituary.wake_at ? `<br/><span style="color:#4F6478;">${dateTimeFormatter.format(new Date(obituary.wake_at))}</span>` : ""
      }</p>`,
    );
  }
  if (obituary.burial_location) {
    details.push(
      `<p style="margin:12px 0 0;"><strong style="color:#16283D;">Sepultamento:</strong><br/>${escapeHtml(obituary.burial_location)}${
        obituary.burial_at ? `<br/><span style="color:#4F6478;">${dateTimeFormatter.format(new Date(obituary.burial_at))}</span>` : ""
      }</p>`,
    );
  }

  const html = renderEmail({
    title: escapeHtml(obituary.name),
    bodyHtml: `
      <p>Olá${subscriber.name ? `, ${escapeHtml(subscriber.name)}` : ""}.</p>
      <p>Informamos o falecimento de <strong>${escapeHtml(obituary.name)}</strong>,
      em ${dateFormatter.format(new Date(obituary.deceased_at))}.</p>
      ${details.join("")}
    `,
    ctaLabel: "Ver página completa",
    ctaUrl: obituaryUrl,
    footerNote: `Você recebe este aviso porque se inscreveu no site da Funerária Paníco. <a href="${unsubscribeUrl}" style="color:#4F6478;">Cancelar inscrição</a>.`,
  });

  await sendEmail(subscriber.email, `Obituário — ${obituary.name}`, html);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
