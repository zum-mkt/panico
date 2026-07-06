import { Seo } from "@/components/seo/Seo";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { DynamicFormRenderer } from "@/components/sections/DynamicFormRenderer";

export function Contato() {
  return (
    <main className="mx-auto max-w-xl space-y-10 px-6 py-24">
      <Seo
        title="Contato"
        description="Fale com a Funerária Paníco. Preencha o formulário e nossa equipe retorna o quanto antes."
      />
      <SectionTitle eyebrow="Fale conosco" title="Contato" />
      <DynamicFormRenderer slug="contato" />
    </main>
  );
}
