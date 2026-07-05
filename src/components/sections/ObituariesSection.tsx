import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listRecentObituaries } from "@/services/homeService";
import { SectionTitle } from "./SectionTitle";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });

export function ObituariesSection() {
  const { data: obituaries } = useQuery({
    queryKey: ["home", "obituaries"],
    queryFn: () => listRecentObituaries(),
  });

  if (!obituaries?.length) return null;

  return (
    <section className="mx-auto max-w-6xl space-y-12 px-6 py-20">
      <SectionTitle eyebrow="Obituários" title="Homenagens recentes" />
      <div className="grid gap-6 md:grid-cols-3">
        {obituaries.map((obituary, i) => (
          <Reveal
            key={obituary.id}
            delay={i * 0.08}
            className="overflow-hidden rounded-card border border-border bg-card"
          >
            <Link to={`/obituarios/${obituary.id}`} className="block space-y-3">
              {obituary.photo_url && (
                <img
                  src={obituary.photo_url}
                  alt={obituary.name}
                  loading="lazy"
                  decoding="async"
                  className="aspect-video w-full object-cover"
                />
              )}
              <div className="space-y-1 px-6 pb-6">
                <h3 className="font-heading text-lg text-primary">{obituary.name}</h3>
                <p className="text-sm text-secondary">
                  {dateFormatter.format(new Date(obituary.deceased_at))}
                </p>
                {obituary.wake_location && (
                  <p className="text-sm text-secondary">{obituary.wake_location}</p>
                )}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      <div className="text-center">
        <Button asChild variant="outline">
          <Link to="/obituarios">Ver todos os obituários</Link>
        </Button>
      </div>
    </section>
  );
}
