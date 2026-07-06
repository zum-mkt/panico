import { Seo } from "@/components/seo/Seo";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { DynamicFormRenderer } from "@/components/sections/DynamicFormRenderer";
import { ContactLocations } from "@/components/sections/ContactLocations";

export function Contato() {
  return (
    <main className="py-24">
      <Seo
        title="Contato"
        description="Fale com a Funerária Paníco. Preencha o formulário e nossa equipe retorna o quanto antes."
      />
      <div className="mx-auto max-w-xl space-y-10 px-6">
        <SectionTitle eyebrow="Fale conosco" title="Contato" />
        <DynamicFormRenderer slug="contato" />
      </div>
      <ContactLocations />
    </main>
  );
}
