import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPublishedPageBySlug } from "@/services/pagesService";
import type { PageSection } from "@/types/page";
import { Seo } from "@/components/seo/Seo";
import { Hero } from "@/components/sections/Hero";
import { CTA } from "@/components/sections/CTA";
import { Timeline } from "@/components/sections/Timeline";
import { Gallery } from "@/components/sections/Gallery";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { DynamicFormRenderer } from "@/components/sections/DynamicFormRenderer";
import { Reveal } from "@/components/ui/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function youtubeEmbedUrl(url?: string) {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

function Block({ section }: { section: PageSection }) {
  const c = section.content as Record<string, string>;

  switch (section.type) {
    case "hero":
      return (
        <Hero
          eyebrow={c.eyebrow}
          title={c.title ?? ""}
          description={c.description}
          imageUrl={c.image_url ?? "/hero-placeholder.svg"}
          primaryCta={c.primary_label ? { label: c.primary_label, href: c.primary_href ?? "#" } : undefined}
          secondaryCta={c.secondary_label ? { label: c.secondary_label, href: c.secondary_href ?? "#" } : undefined}
        />
      );

    case "text":
      return (
        <section className="mx-auto max-w-3xl space-y-4 px-6 py-16">
          {c.title && <SectionTitle title={c.title} />}
          {c.body && (
            <Reveal>
              <div
                className="prose prose-neutral max-w-none prose-headings:font-heading prose-headings:text-primary"
                dangerouslySetInnerHTML={{ __html: c.body }}
              />
            </Reveal>
          )}
        </section>
      );

    case "image":
      return (
        <section className="mx-auto max-w-5xl space-y-2 px-6 py-10">
          <Reveal variant="scale" className="overflow-hidden rounded-card">
            <img src={c.url} alt={c.alt ?? ""} className="w-full object-cover" loading="lazy" />
          </Reveal>
          {c.caption && <p className="text-center text-sm text-secondary">{c.caption}</p>}
        </section>
      );

    case "cta":
      return (
        <section className="mx-auto max-w-6xl px-6 py-10">
          <CTA
            title={c.title ?? ""}
            description={c.description}
            primaryCta={c.primary_label ? { label: c.primary_label, href: c.primary_href ?? "#" } : undefined}
          />
        </section>
      );

    case "cards": {
      const items = (section.content.items as { title: string; description?: string }[]) ?? [];
      return (
        <section className="mx-auto max-w-6xl space-y-10 px-6 py-16">
          {c.title && <SectionTitle title={c.title} />}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {items.map((item, i) => (
              <Reveal key={i} delay={i * 0.06} className="space-y-2 rounded-card border border-border bg-card p-6">
                <h3 className="font-heading text-lg text-primary">{item.title}</h3>
                {item.description && <p className="text-sm text-secondary">{item.description}</p>}
              </Reveal>
            ))}
          </div>
        </section>
      );
    }

    case "faq": {
      const items = (section.content.items as { question: string; answer: string }[]) ?? [];
      return (
        <section className="mx-auto max-w-3xl space-y-10 px-6 py-16">
          {c.title && <SectionTitle title={c.title} />}
          <Accordion type="single" collapsible>
            {items.map((item, i) => (
              <AccordionItem key={i} value={String(i)}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      );
    }

    case "timeline": {
      const items = (section.content.items as { title: string; description?: string; date?: string }[]) ?? [];
      return (
        <section className="mx-auto max-w-3xl space-y-10 px-6 py-16">
          {c.title && <SectionTitle title={c.title} />}
          <Timeline items={items} />
        </section>
      );
    }

    case "gallery": {
      const images = (section.content.images as string[]) ?? [];
      return (
        <section className="mx-auto max-w-6xl space-y-10 px-6 py-16">
          {c.title && <SectionTitle title={c.title} />}
          <Gallery images={images.map((src) => ({ src, alt: "" }))} />
        </section>
      );
    }

    case "video":
      return (
        <section className="mx-auto max-w-4xl space-y-6 px-6 py-16">
          {c.title && <SectionTitle title={c.title} />}
          <Reveal className="aspect-video overflow-hidden rounded-card">
            <iframe
              className="h-full w-full"
              src={youtubeEmbedUrl(c.youtube_url) ?? undefined}
              title={c.title ?? "Vídeo"}
              loading="lazy"
              allowFullScreen
            />
          </Reveal>
        </section>
      );

    case "form":
      return (
        <section className="mx-auto max-w-xl space-y-6 px-6 py-16">
          {c.title && <SectionTitle title={c.title} />}
          {c.form_slug && <DynamicFormRenderer slug={c.form_slug} />}
        </section>
      );

    default:
      return null;
  }
}

export function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data } = useQuery({
    queryKey: ["pages", slug],
    queryFn: () => getPublishedPageBySlug(slug!),
    enabled: !!slug,
  });

  if (!data) return null;

  return (
    <main>
      <Seo
        title={data.page.seo_title || data.page.title}
        description={data.page.seo_description ?? undefined}
      />
      {data.sections.map((section) => (
        <Block key={section.id} section={section} />
      ))}
    </main>
  );
}
