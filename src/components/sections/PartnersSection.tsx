import { useQuery } from "@tanstack/react-query";
import { listActivePartners, getSetting } from "@/services/homeService";
import { SectionTitle } from "./SectionTitle";
import { SectionTitleSkeleton, CardGridSkeleton } from "./SectionSkeleton";
import { Reveal } from "@/components/ui/reveal";

type PartnersContent = { eyebrow?: string; title?: string; description?: string };

export function PartnersSection() {
  const { data: partners, isLoading } = useQuery({
    queryKey: ["home", "partners"],
    queryFn: listActivePartners,
  });
  const { data: content } = useQuery({
    queryKey: ["settings", "home_partners"],
    queryFn: () => getSetting<PartnersContent>("home_partners"),
  });

  if (isLoading) {
    return (
      <section className="mx-auto max-w-6xl space-y-12 px-6 py-20">
        <SectionTitleSkeleton />
        <CardGridSkeleton count={3} cols="sm:grid-cols-2 md:grid-cols-3" />
      </section>
    );
  }

  if (!partners?.length) return null;

  return (
    <section className="mx-auto max-w-6xl space-y-12 px-6 py-20">
      <SectionTitle
        eyebrow={content?.eyebrow || "Rede de vantagens"}
        title={content?.title || "Parceiros Paníco"}
        description={content?.description}
      />
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {partners.map((partner, i) => {
          const Wrapper = partner.link_url ? "a" : "div";
          return (
            <Reveal key={partner.id} delay={i * 0.06} hover as="div">
              <Wrapper
                {...(partner.link_url
                  ? { href: partner.link_url, target: "_blank", rel: "noreferrer" }
                  : {})}
                className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-card"
              >
                {partner.photo_url && (
                  <img
                    src={partner.photo_url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="aspect-video w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col gap-2 p-6">
                  {partner.logo_url ? (
                    <img
                      src={partner.logo_url}
                      alt={partner.name}
                      loading="lazy"
                      decoding="async"
                      className="h-8 w-fit object-contain object-left"
                    />
                  ) : (
                    <h3 className="font-heading text-lg text-primary">{partner.name}</h3>
                  )}
                  {partner.description && (
                    <p className="text-sm text-secondary">{partner.description}</p>
                  )}
                </div>
              </Wrapper>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
