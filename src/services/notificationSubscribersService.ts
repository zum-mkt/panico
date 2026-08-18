import { supabase } from "@/supabase/client";
import type { NotificationSubscriber } from "@/types/notificationSubscriber";

export async function subscribeToObituaryNotifications(email: string) {
  const { error } = await supabase.from("notification_subscribers").insert({ email });
  if (error) {
    // Índice único por e-mail (lower(email)) — mensagem amigável em vez do erro cru do Postgres.
    if (error.code === "23505") {
      throw new Error("Este e-mail já está inscrito.");
    }
    throw error;
  }
}

export async function confirmSubscription(token: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("confirm_subscription", { token });
  if (error) throw error;
  return data as boolean;
}

export async function unsubscribeNotification(token: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("unsubscribe_subscription", { token });
  if (error) throw error;
  return data as boolean;
}

export async function listSubscribersAdmin(): Promise<NotificationSubscriber[]> {
  const { data, error } = await supabase
    .from("notification_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function removeSubscriberAdmin(id: string) {
  const { error } = await supabase.from("notification_subscribers").delete().eq("id", id);
  if (error) throw error;
}

export function subscribersToCsv(subscribers: NotificationSubscriber[]): string {
  const statusLabel: Record<NotificationSubscriber["status"], string> = {
    pending: "Aguardando confirmação",
    confirmed: "Confirmado",
    unsubscribed: "Descadastrado",
  };
  const headers = ["Nome", "E-mail", "Status", "Inscrito em"];
  const rows = subscribers.map((s) => [
    s.name ?? "",
    s.email,
    statusLabel[s.status],
    new Date(s.created_at).toLocaleString("pt-BR"),
  ]);
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
}
