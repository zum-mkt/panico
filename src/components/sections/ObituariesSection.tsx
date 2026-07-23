import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Flame, Calendar, MapPin, Clock, ArrowRight, ArrowUpRight } from "lucide-react";
import { listRecentObituaries } from "@/services/homeService";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });
const timeFormatter = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

export function ObituariesSection() {
  const { data: obituaries } = useQuery({
    queryKey: ["home", "obituaries"],
    queryFn: () => listRecentObituaries(),
  });

  if (!obituaries?.length) return null;

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl space-y-10 rounded-4xl border border-border bg-gradient-to-b from-primary/[0.04] to-transparent px-6 py-14 md:px-12">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-medium tracking-wide text-accent">
              <Flame className="size-3.5" />
              Obituários
            </span>
            <p className="max-w-md text-sm text-secondary">
              Prestamos nossas homenagens às famílias que confiaram seu cuidado a nós.
            </p>
          </div>
          <Button asChild variant="ghost" className="text-primary hover:text-primary">
            <Link to="/obituarios" className="flex items-center gap-1.5">
              Ver todos os obituários
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {obituaries.map((obituary, i) => (
            <Reveal
              key={obituary.id}
              delay={i * 0.08}
              hover
              className="group overflow-hidden rounded-card border border-border bg-card shadow-sm transition-colors hover:border-accent/40"
            >
              <Link to={`/obituarios/${obituary.id}`} className="flex h-full flex-col">
                {obituary.photo_url && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary/5">
                    <img
                      src={obituary.photo_url}
                      alt={obituary.name}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3 px-6 pt-5 pb-4">
                  <div className="rounded-2xl border border-accent/15 bg-accent/[0.07] px-4 py-3">
                    <h3 className="font-heading text-lg text-primary">{obituary.name}</h3>
                    {obituary.age != null && (
                      <p className="mt-0.5 text-sm text-secondary">{obituary.age} anos</p>
                    )}
                    <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-secondary">
                      <Calendar className="size-3" />
                      {dateFormatter.format(new Date(obituary.deceased_at))}
                    </span>
                  </div>
                  {obituary.wake_location && (
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium tracking-wide text-accent">Velório</p>
                      <p className="flex items-center gap-1.5 text-sm text-secondary">
                        <MapPin className="size-3.5 shrink-0 text-accent" />
                        <span className="line-clamp-1">{obituary.wake_location}</span>
                      </p>
                      {obituary.wake_at && (
                        <p className="flex items-center gap-1.5 text-xs text-secondary/80">
                          <Clock className="size-3 shrink-0" />
                          Horário: {timeFormatter.format(new Date(obituary.wake_at))}
                        </p>
                      )}
                    </div>
                  )}
                  {obituary.burial_location && (
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium tracking-wide text-accent">Sepultamento</p>
                      <p className="flex items-center gap-1.5 text-sm text-secondary">
                        <MapPin className="size-3.5 shrink-0 text-accent" />
                        <span className="line-clamp-1">{obituary.burial_location}</span>
                      </p>
                      {obituary.burial_at && (
                        <p className="flex items-center gap-1.5 text-xs text-secondary/80">
                          <Clock className="size-3 shrink-0" />
                          Horário: {timeFormatter.format(new Date(obituary.burial_at))}
                        </p>
                      )}
                    </div>
                  )}
                  <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    Mais informações
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
