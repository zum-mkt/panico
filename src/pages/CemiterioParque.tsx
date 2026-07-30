import { useQuery } from "@tanstack/react-query";
import { Seo } from "@/components/seo/Seo";
import { useSeoPage } from "@/hooks/useSeoPage";
import { usePageHero } from "@/hooks/usePageHero";
import { Hero } from "@/components/sections/Hero";
import { Clock, MapPin } from "lucide-react";
import {
  listActiveCemeterySections,
  listCemeteryFaq,
} from "@/services/cemeteryService";
import type {
  GalleryContent,
  HoursContent,
  LocationContent,
  TextBlockContent,
  VideoContent,
} from "@/types/cemetery";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { Gallery } from "@/components/sections/Gallery";
import { CTA } from "@/components/sections/CTA";
import { Reveal } from "@/components/ui/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CEMETERY_CLIENT_AREA_URL = "https://apps.mssistemas.com.br/areacliente.php/login/?&app=&codigo=1020";

function youtubeEmbedUrl(url?: string) {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  const id = match?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : url;
}

export function CemiterioParque() {
  const { data: sections } = useQuery({
    queryKey: ["cemetery", "public"],
    queryFn: listActiveCemeterySections,
  });
  const { data: faqs } = useQuery({ queryKey: ["cemetery", "faq"], queryFn: listCemeteryFaq });

  const byKey = Object.fromEntries((sections ?? []).map((s) => [s.section, s.content])) as Record<
    string,
    unknown
  >;

  const history = byKey.history as TextBlockContent | undefined;
  const structure = byKey.structure as TextBlockContent | undefined;
  const gallery = byKey.gallery as GalleryContent | undefined;
  const video = byKey.video as VideoContent | undefined;
  const drone = byKey.drone as VideoContent | undefined;
  const location = byKey.location as LocationContent | undefined;
  const hours = byKey.hours as HoursContent | undefined;
  const seo = useSeoPage("cemiterio", {
    title: "Cemitério Parque",
    description: "Conheça o Cemitério Parque Paníco: estrutura, galeria, localização e horários de funcionamento.",
  });
  const { data: hero } = usePageHero("cemiterio_hero");

  return (
    <main className="space-y-20 pb-20">
      <Seo title={seo.title} description={seo.description} />

      <Hero
        eyebrow={hero?.eyebrow || "Cemitério Parque"}
        title={hero?.title || "Um espaço de paz e memória"}
        description={hero?.description}
        imageUrl={hero?.image_url || "/hero-placeholder.svg"}
        primaryCta={
          hero?.primary_label
            ? {
                label: hero.primary_label,
                href: hero.primary_href || "#localizacao",
                external: /^https?:\/\//.test(hero.primary_href || ""),
              }
            : undefined
        }
      />

      {history?.text && (
        <section className="mx-auto grid max-w-6xl items-center gap-8 px-6 md:grid-cols-2">
          {history.image_url && (
            <Reveal variant="scale" className="overflow-hidden rounded-card">
              <img src={history.image_url} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
            </Reveal>
          )}
          <Reveal className="space-y-3">
            <h2 className="font-heading text-2xl text-primary">{history.title || "História"}</h2>
            <p className="text-secondary">{history.text}</p>
          </Reveal>
        </section>
      )}

      {structure?.text && (
        <section className="mx-auto grid max-w-6xl items-center gap-8 px-6 md:grid-cols-2">
          <Reveal className="order-2 space-y-3 md:order-1">
            <h2 className="font-heading text-2xl text-primary">
              {structure.title || "Estrutura"}
            </h2>
            <p className="text-secondary">{structure.text}</p>
          </Reveal>
          {structure.image_url && (
            <Reveal variant="scale" className="order-1 overflow-hidden rounded-card md:order-2">
              <img
                src={structure.image_url}
                alt=""
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </Reveal>
          )}
        </section>
      )}

      {!!gallery?.images?.length && (
        <section className="mx-auto max-w-6xl space-y-10 px-6">
          <SectionTitle eyebrow="Galeria" title="Conheça nossos espaços" />
          <Gallery images={gallery.images.map((src) => ({ src, alt: "" }))} />
        </section>
      )}

      {video?.youtube_url && (
        <section className="mx-auto max-w-4xl space-y-6 px-6">
          <SectionTitle eyebrow="Vídeo" title={video.title || "Conheça em vídeo"} />
          <Reveal className="aspect-video overflow-hidden rounded-card">
            <iframe
              className="h-full w-full"
              src={youtubeEmbedUrl(video.youtube_url) ?? undefined}
              title="Vídeo"
              loading="lazy"
              allowFullScreen
            />
          </Reveal>
        </section>
      )}

      {drone?.youtube_url && (
        <section className="mx-auto max-w-4xl space-y-6 px-6">
          <SectionTitle eyebrow="Vista aérea" title={drone.title || "Imagens de drone"} />
          <Reveal className="aspect-video overflow-hidden rounded-card">
            <iframe
              className="h-full w-full"
              src={youtubeEmbedUrl(drone.youtube_url) ?? undefined}
              title="Vídeo drone"
              loading="lazy"
              allowFullScreen
            />
          </Reveal>
        </section>
      )}

      {(location?.address || hours?.schedule?.length) && (
        <section className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2" id="localizacao">
          {location?.address && (
            <Reveal className="space-y-4">
              <p className="flex items-center gap-2 font-heading text-lg text-primary">
                <MapPin className="size-5" /> Localização
              </p>
              <iframe
                title="Mapa"
                className="h-64 w-full rounded-card border border-border"
                loading="lazy"
                src={`https://www.google.com/maps?q=${encodeURIComponent(location.address)}&output=embed`}
              />
            </Reveal>
          )}
          {!!hours?.schedule?.length && (
            <Reveal className="space-y-4">
              <p className="flex items-center gap-2 font-heading text-lg text-primary">
                <Clock className="size-5" /> Horários
              </p>
              <ul className="space-y-2 rounded-card border border-border bg-card p-6">
                {hours.schedule!.map((h) => (
                  <li key={h.day} className="flex justify-between text-sm">
                    <span>{h.day}</span>
                    <span className="text-secondary">{h.hours}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6">
        <CTA
          title="Já é titular de um jazigo no Cemitério Parque?"
          description="Acesse a área do cliente para consultar dados, 2ª via de documentos e histórico do seu jazigo."
          primaryCta={{
            label: "Acessar área do cliente",
            href: CEMETERY_CLIENT_AREA_URL,
            external: true,
          }}
        />
      </section>

      {!!faqs?.length && (
        <section className="mx-auto max-w-3xl space-y-10 px-6">
          <SectionTitle eyebrow="Dúvidas" title="Perguntas frequentes" />
          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}
    </main>
  );
}
