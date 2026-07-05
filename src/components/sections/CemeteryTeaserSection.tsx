import { Link } from "react-router-dom";
import { SectionTitle } from "./SectionTitle";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function CemeteryTeaserSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal
        variant="scale"
        className="grid items-center gap-8 overflow-hidden rounded-hero bg-secondary/10 p-10 md:grid-cols-2 md:p-16"
      >
        <div className="space-y-4">
          <SectionTitle
            align="left"
            eyebrow="Cemitério Parque"
            title="Um espaço de paz e memória"
            description="Estrutura completa, jardins cuidados e localização de fácil acesso para toda a família."
            className="mx-0"
          />
          <Button asChild>
            <Link to="/cemiterio">Conhecer o Cemitério Parque</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
