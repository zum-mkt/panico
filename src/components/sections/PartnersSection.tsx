import { useQuery } from "@tanstack/react-query";
import { listActivePartners } from "@/services/homeService";
import { SectionTitle } from "./SectionTitle";
import { Reveal } from "@/components/ui/reveal";

export function PartnersSection() {
  const { data: partners } = useQuery({
    queryKey: ["home", "partners"],
    queryFn: listActivePartners,
  });

  if (!partners?.length) return null;

  return (
    <section className="mx-auto max-w-6xl space-y-10 px-6 py-20">
      <SectionTitle eyebrow="Rede de vantagens" title="Parceiros Paníco" />
      <Reveal variant="fade" className="flex flex-wrap items-center justify-center gap-10">
        {partners.map((partner) =>
          partner.logo_url ? (
            <img
              key={partner.id}
              src={partner.logo_url}
              alt={partner.name}
              loading="lazy"
              decoding="async"
              className="h-10 grayscale opacity-70 transition hover:opacity-100 hover:grayscale-0"
            />
          ) : (
            <span key={partner.id} className="text-secondary">
              {partner.name}
            </span>
          ),
        )}
      </Reveal>
    </section>
  );
}
