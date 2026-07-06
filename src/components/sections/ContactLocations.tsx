import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { getSetting } from "@/services/homeService";
import { Reveal } from "@/components/ui/reveal";
import type { Location } from "@/types/location";

export function ContactLocations() {
  const { data: locations } = useQuery({
    queryKey: ["settings", "locations"],
    queryFn: () => getSetting<Location[]>("locations"),
  });

  if (!locations?.length) return null;

  return (
    <section className="mx-auto max-w-6xl space-y-10 px-6 py-16">
      <div className="grid gap-8 md:grid-cols-3">
        {locations.map((location, i) => {
          const mapsQuery = encodeURIComponent(location.address);
          return (
            <Reveal key={location.name + i} delay={i * 0.06} className="space-y-3">
              <h3 className="font-heading text-lg text-primary">{location.name}</h3>
              {location.address && (
                <p className="flex items-start gap-2 text-sm text-secondary">
                  <MapPin className="mt-0.5 size-4 shrink-0" /> {location.address}
                </p>
              )}
              {location.email && (
                <a
                  href={`mailto:${location.email}`}
                  className="flex items-center gap-2 text-sm text-secondary hover:text-primary"
                >
                  <Mail className="size-4 shrink-0" /> {location.email}
                </a>
              )}
              {location.phone && (
                <a
                  href={`tel:+55${location.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 text-sm text-secondary hover:text-primary"
                >
                  <Phone className="size-4 shrink-0" /> {location.phone}
                </a>
              )}
              {location.address && (
                <>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Abrir no Maps <ExternalLink className="size-3.5" />
                  </a>
                  <iframe
                    title={`Mapa — ${location.name}`}
                    src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
                    loading="lazy"
                    className="aspect-square w-full rounded-card border border-border"
                  />
                </>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
