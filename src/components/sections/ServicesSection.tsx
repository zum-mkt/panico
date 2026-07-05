import { useQuery } from "@tanstack/react-query";
import { listActiveServices } from "@/services/homeService";
import { resolveIcon } from "@/lib/iconMap";
import { SectionTitle } from "./SectionTitle";
import { Reveal } from "@/components/ui/reveal";

export function ServicesSection() {
  const { data: services } = useQuery({
    queryKey: ["home", "services"],
    queryFn: listActiveServices,
  });

  if (!services?.length) return null;

  return (
    <section className="mx-auto max-w-6xl space-y-12 px-6 py-20">
      <SectionTitle eyebrow="O que oferecemos" title="Nossos serviços" />
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {services.map((service, i) => {
          const Icon = resolveIcon(service.icon);
          return (
            <Reveal
              key={service.id}
              delay={i * 0.06}
              className="space-y-3 rounded-card border border-border bg-card p-6"
            >
              <Icon className="size-6 text-accent" />
              <h3 className="font-heading text-lg text-primary">{service.title}</h3>
              {service.description && (
                <p className="text-sm text-secondary">{service.description}</p>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
