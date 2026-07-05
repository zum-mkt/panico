import { useQuery } from "@tanstack/react-query";
import { HeartHandshake, ClipboardList, Wrench, Image } from "lucide-react";
import {
  getDashboardStats,
  getRecentObituaries,
  getRecentMedia,
} from "@/services/dashboardService";

const statCards = [
  { key: "obituaries" as const, label: "Obituários", icon: HeartHandshake },
  { key: "plans" as const, label: "Planos", icon: ClipboardList },
  { key: "services" as const, label: "Serviços", icon: Wrench },
  { key: "media" as const, label: "Arquivos na mídia", icon: Image },
];

export function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
  });
  const { data: recentObituaries } = useQuery({
    queryKey: ["dashboard", "recent-obituaries"],
    queryFn: () => getRecentObituaries(),
  });
  const { data: recentMedia } = useQuery({
    queryKey: ["dashboard", "recent-media"],
    queryFn: () => getRecentMedia(),
  });

  return (
    <div className="space-y-10 p-8">
      <div>
        <h1 className="font-heading text-2xl text-primary">Dashboard</h1>
        <p className="text-secondary">Visão geral do conteúdo do site.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="flex items-center gap-3 rounded-card border border-border bg-card p-6"
          >
            <Icon className="size-6 text-accent" />
            <div>
              <p className="text-2xl">{stats?.[key] ?? "—"}</p>
              <p className="text-sm text-secondary">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-card border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg">Últimos conteúdos</h2>
          {recentObituaries?.length ? (
            <ul className="space-y-2">
              {recentObituaries.map((o) => (
                <li key={o.id} className="flex justify-between text-sm">
                  <span>{o.name}</span>
                  <span className="text-secondary">{o.deceased_at}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-secondary">Nenhum conteúdo ainda.</p>
          )}
        </section>

        <section className="rounded-card border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg">Uploads recentes</h2>
          {recentMedia?.length ? (
            <ul className="space-y-2">
              {recentMedia.map((m) => (
                <li key={m.id} className="truncate text-sm">
                  {m.alt_text || m.url}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-secondary">Nenhum upload ainda.</p>
          )}
        </section>
      </div>
    </div>
  );
}
