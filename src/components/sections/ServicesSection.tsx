import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listActiveServices } from "@/services/homeService";
import { resolveIcon } from "@/lib/iconMap";
import { SectionTitle } from "./SectionTitle";
import { Reveal } from "@/components/ui/reveal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type HomeService = NonNullable<
  Awaited<ReturnType<typeof listActiveServices>>
>[number];

export function ServicesSection() {
  const { data: services } = useQuery({
    queryKey: ["home", "services"],
    queryFn: listActiveServices,
  });
  const [selected, setSelected] = useState<HomeService | null>(null);

  if (!services?.length) return null;

  return (
    <section className="mx-auto max-w-6xl space-y-12 px-6 py-20">
      <SectionTitle eyebrow="O que oferecemos" title="Nossos serviços" />
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {services.map((service, i) => {
          const Icon = resolveIcon(service.icon);
          return (
            <Reveal key={service.id} delay={i * 0.06} hover as="div">
              <button
                type="button"
                onClick={() => setSelected(service)}
                className="w-full space-y-3 rounded-card border border-border bg-card p-6 text-left"
              >
                <Icon className="size-6 text-accent" />
                <h3 className="font-heading text-lg text-primary">{service.title}</h3>
                {service.description && (
                  <p className="text-sm text-secondary">{service.description}</p>
                )}
              </button>
            </Reveal>
          );
        })}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg space-y-4">
          {selected && (
            <>
              <DialogHeader>
                {selected.image_url && (
                  <img
                    src={selected.image_url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="mb-2 aspect-video w-full rounded-card object-cover"
                  />
                )}
                <DialogTitle className="text-xl">{selected.title}</DialogTitle>
              </DialogHeader>

              {selected.content_html ? (
                <div
                  className="prose prose-neutral max-w-none prose-headings:font-heading prose-headings:text-primary"
                  dangerouslySetInnerHTML={{ __html: selected.content_html }}
                />
              ) : (
                selected.description && (
                  <p className="text-sm text-secondary">{selected.description}</p>
                )
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
