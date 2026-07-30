import { Seo } from "@/components/seo/Seo";
import { useSeoPage } from "@/hooks/useSeoPage";
import { usePageHero } from "@/hooks/usePageHero";
import { Hero } from "@/components/sections/Hero";
import { DynamicFormRenderer } from "@/components/sections/DynamicFormRenderer";
import { ContactLocations } from "@/components/sections/ContactLocations";

export function Contato() {
  const seo = useSeoPage("contato", {
    title: "Contato",
    description: "Fale com a Funerária Paníco. Preencha o formulário e nossa equipe retorna o quanto antes.",
  });
  const { data: hero } = usePageHero("contato_hero");

  return (
    <main>
      <Seo title={seo.title} description={seo.description} />

      <Hero
        eyebrow={hero?.eyebrow || "Fale conosco"}
        title={hero?.title || "Contato"}
        description={hero?.description}
        imageUrl={hero?.image_url || "/hero-placeholder.svg"}
        primaryCta={hero?.primary_label ? { label: hero.primary_label, href: "#formulario" } : undefined}
      />

      <div id="formulario" className="mx-auto max-w-xl space-y-10 px-6 py-24">
        <DynamicFormRenderer slug="contato" />
      </div>
      <ContactLocations />
    </main>
  );
}
