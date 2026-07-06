import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { listPublishedObituaries } from "@/services/obituariesService";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { Reveal } from "@/components/ui/reveal";
import { Input } from "@/components/ui/input";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });

export function Obituarios() {
  const [query, setQuery] = useState("");
  const { data: obituaries } = useQuery({
    queryKey: ["obituaries", "published"],
    queryFn: listPublishedObituaries,
  });

  const filtered = useMemo(() => {
    if (!obituaries) return [];
    const q = query.trim().toLowerCase();
    if (!q) return obituaries;
    return obituaries.filter((o) => o.name.toLowerCase().includes(q));
  }, [obituaries, query]);

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-6 py-24">
      <Seo
        title="Obituários"
        description="Consulte homenagens e informações de velório e sepultamento da Funerária Paníco."
      />

      <SectionTitle eyebrow="Homenagens" title="Obituários" align="left" className="mx-0" />

      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-secondary" />
        <Input
          placeholder="Buscar por nome…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-secondary">Nenhum obituário encontrado.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {filtered.map((obituary, i) => (
            <Reveal key={obituary.id} delay={i * 0.05} as="div" hover>
              <Link
                to={`/obituarios/${obituary.id}`}
                className="block space-y-3 overflow-hidden rounded-card border border-border bg-card"
              >
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
                  <h2 className="font-heading text-lg text-primary">{obituary.name}</h2>
                  <p className="text-sm text-secondary">
                    {dateFormatter.format(new Date(obituary.deceased_at))}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </main>
  );
}
