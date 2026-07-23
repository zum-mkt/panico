import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Flame, Calendar, MapPin, ArrowRight, ArrowUpRight } from "lucide-react";
import { listRecentObituaries } from "@/services/homeService";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

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
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary/5">
                  {obituary.photo_url ? (
                    <img
                      src={obituary.photo_url}
                      alt={obituary.name}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10">
                      <span className="font-heading text-3xl text-primary/50">
                        {initials(obituary.name)}
                      </span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-primary shadow-sm backdrop-blur">
                    <Calendar className="size-3" />
                    {dateFormatter.format(new Date(obituary.deceased_at))}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 border-t border-border px-6 py-5">
                  <h3 className="font-heading text-lg text-primary">{obituary.name}</h3>
                  {obituary.wake_location && (
                    <p className="flex items-center gap-1.5 text-sm text-secondary">
                      <MapPin className="size-3.5 shrink-0 text-accent" />
                      <span className="line-clamp-1">{obituary.wake_location}</span>
                    </p>
                  )}
                  <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    Ver homenagem
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
