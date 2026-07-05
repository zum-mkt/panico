import { Hero } from "@/components/sections/Hero";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { Testimonial } from "@/components/sections/Testimonial";
import { Timeline } from "@/components/sections/Timeline";
import { Gallery } from "@/components/sections/Gallery";
import { CTA } from "@/components/sections/CTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sampleImage =
  "data:image/svg+xml;base64," +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="%2372886C"/></svg>'.replace(
      /%23/g,
      "#",
    ),
  );

export function DesignSystemPreview() {
  return (
    <div className="space-y-24 pb-24">
      <Hero
        eyebrow="Funerária Paníco"
        title="Cuidado, respeito e acolhimento em cada momento"
        description="Estamos ao seu lado com serenidade e profissionalismo, 24 horas por dia."
        imageUrl={sampleImage}
        primaryCta={{ label: "Ver planos", href: "#" }}
        secondaryCta={{ label: "Atendimento 24h", href: "#" }}
      />

      <section className="mx-auto max-w-6xl space-y-10 px-6">
        <SectionTitle
          eyebrow="Botões"
          title="Variantes de Button"
          description="Componentes reutilizáveis do design system."
        />
        <div className="flex flex-wrap justify-center gap-3">
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destrutivo</Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-6">
        <SectionTitle eyebrow="Cards" title="Serviços" />
        <div className="grid gap-6 md:grid-cols-3">
          {["Velório", "Sepultamento", "Cremação"].map((title) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary">
                Descrição breve do serviço oferecido com todo o cuidado necessário.
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-6">
        <SectionTitle eyebrow="Depoimentos" title="Quem confia na Paníco" />
        <div className="grid gap-6 md:grid-cols-2">
          <Testimonial
            authorName="Maria Souza"
            content="Fomos muito bem acolhidos em um momento difícil. Equipe atenciosa do início ao fim."
            rating={5}
          />
          <Testimonial
            authorName="João Pereira"
            content="Profissionalismo e respeito em todos os detalhes."
            rating={5}
          />
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-10 px-6">
        <SectionTitle eyebrow="História" title="Nossa trajetória" />
        <Timeline
          items={[
            { date: "1998", title: "Fundação", description: "Início das atividades." },
            { date: "2010", title: "Cemitério Parque", description: "Expansão da estrutura." },
            { date: "2024", title: "Novo site", description: "Plataforma digital completa." },
          ]}
        />
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-6">
        <SectionTitle eyebrow="Galeria" title="Nossa estrutura" />
        <Gallery
          images={Array.from({ length: 6 }).map((_, i) => ({
            src: sampleImage,
            alt: `Foto ${i + 1}`,
          }))}
        />
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-6">
        <SectionTitle eyebrow="FAQ" title="Dúvidas frequentes" />
        <Accordion type="single" collapsible className="mx-auto max-w-2xl">
          <AccordionItem value="a">
            <AccordionTrigger>Como funciona o atendimento 24h?</AccordionTrigger>
            <AccordionContent>
              Nossa central está disponível todos os dias, a qualquer hora.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Como contratar um plano?</AccordionTrigger>
            <AccordionContent>Entre em contato pelo telefone ou WhatsApp.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <CTA
          title="Estamos aqui para ajudar"
          description="Fale com nossa equipe a qualquer momento."
          primaryCta={{ label: "Falar no WhatsApp", href: "#" }}
        />
      </section>
    </div>
  );
}
