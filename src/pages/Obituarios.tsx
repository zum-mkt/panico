import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { listPublishedObituariesPage } from "@/services/obituariesService";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { Reveal } from "@/components/ui/reveal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Obituary } from "@/types/obituary";

const PAGE_SIZE = 15;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });
const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
});

export function Obituarios() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Obituary | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["obituaries", "published", page, query],
    queryFn: () => listPublishedObituariesPage(page, query),
    placeholderData: (previous) => previous,
  });

  const filtered = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.count ?? 0) / PAGE_SIZE));

  function handleQueryChange(value: string) {
    setQuery(value);
    setPage(1);
  }

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
          onChange={(e) => handleQueryChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-secondary">Nenhum obituário encontrado.</p>
      ) : (
        <div
          aria-busy={isFetching}
          className="grid gap-6 md:grid-cols-3"
        >
          {filtered.map((obituary, i) => (
            <Reveal key={obituary.id} delay={i * 0.05} as="div" hover>
              <button
                type="button"
                onClick={() => setSelected(obituary)}
                className="block w-full space-y-3 overflow-hidden rounded-card border border-border bg-card text-left"
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
              </button>
            </Reveal>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Paginação de obituários"
          className="flex items-center justify-center gap-4"
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <p className="text-sm text-secondary">
            Página {page} de {totalPages}
          </p>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Próxima página"
          >
            <ChevronRight className="size-4" />
          </Button>
        </nav>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg space-y-4 sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                {selected.photo_url && (
                  <img
                    src={selected.photo_url}
                    alt={selected.name}
                    loading="lazy"
                    decoding="async"
                    className="mb-2 aspect-video w-full rounded-card object-cover"
                  />
                )}
                <DialogTitle className="text-xl">{selected.name}</DialogTitle>
                <p className="text-sm text-secondary">
                  {dateFormatter.format(new Date(selected.deceased_at))}
                </p>
              </DialogHeader>

              {selected.message && <p className="text-sm text-secondary">{selected.message}</p>}

              <div className="grid gap-4 sm:grid-cols-2">
                {selected.wake_location && (
                  <div className="space-y-1 rounded-card border border-border bg-background p-4">
                    <p className="text-sm font-medium text-accent">Velório</p>
                    <p className="text-sm">{selected.wake_location}</p>
                    {selected.wake_at && (
                      <p className="text-xs text-secondary">
                        {dateTimeFormatter.format(new Date(selected.wake_at))}
                      </p>
                    )}
                  </div>
                )}
                {selected.burial_location && (
                  <div className="space-y-1 rounded-card border border-border bg-background p-4">
                    <p className="text-sm font-medium text-accent">Sepultamento</p>
                    <p className="text-sm">{selected.burial_location}</p>
                    {selected.burial_at && (
                      <p className="text-xs text-secondary">
                        {dateTimeFormatter.format(new Date(selected.burial_at))}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Button asChild className="w-full">
                <Link to={`/obituarios/${selected.id}`}>Ver página completa</Link>
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
