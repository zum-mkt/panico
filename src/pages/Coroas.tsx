import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { listPublicCrowns } from "@/services/crownsService";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function Coroas() {
  const { data: crowns } = useQuery({ queryKey: ["crowns", "public"], queryFn: listPublicCrowns });
  const [category, setCategory] = useState("todas");

  const categories = useMemo(() => {
    const set = new Set<string>();
    crowns?.forEach((c) => c.category && set.add(c.category));
    return Array.from(set);
  }, [crowns]);

  const filtered = useMemo(() => {
    if (!crowns) return [];
    if (category === "todas") return crowns;
    return crowns.filter((c) => c.category === category);
  }, [crowns, category]);

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-6 py-24">
      <Helmet>
        <title>Coroas de Flores — Funerária Paníco</title>
      </Helmet>

      <SectionTitle eyebrow="Catálogo" title="Coroas de Flores" align="left" className="mx-0" />

      {categories.length > 0 && (
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {filtered.length === 0 ? (
        <p className="text-secondary">Nenhuma coroa disponível no momento.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((crown, i) => (
            <Reveal
              key={crown.id}
              delay={i * 0.05}
              className="flex flex-col overflow-hidden rounded-card border border-border bg-card"
            >
              {crown.photos[0] && (
                <img
                  src={crown.photos[0]}
                  alt={crown.title}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full object-cover"
                />
              )}
              <div className="flex flex-1 flex-col gap-2 p-6">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-lg text-primary">{crown.title}</h3>
                  {!crown.is_available && <Badge variant="secondary">Indisponível</Badge>}
                </div>
                {crown.description && (
                  <p className="text-sm text-secondary">{crown.description}</p>
                )}
                {crown.price != null && (
                  <p className="text-xl text-primary">{currency.format(crown.price)}</p>
                )}
                <Button asChild disabled={!crown.is_available} className="mt-auto">
                  <a
                    href={`https://wa.me/5511900000000?text=${encodeURIComponent(
                      `Olá! Gostaria de encomendar a coroa "${crown.title}".`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Encomendar
                  </a>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </main>
  );
}
