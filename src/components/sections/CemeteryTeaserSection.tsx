import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSetting } from "@/services/homeService";
import { SectionTitle } from "./SectionTitle";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

type CemeteryTeaserContent = {
  eyebrow: string;
  title: string;
  description: string;
  cta_label: string;
};

const FALLBACK: CemeteryTeaserContent = {
  eyebrow: "Cemitério Parque",
  title: "Um espaço de paz e memória",
  description: "Estrutura completa, jardins cuidados e localização de fácil acesso para toda a família.",
  cta_label: "Conhecer o Cemitério Parque",
};

export function CemeteryTeaserSection() {
  const { data } = useQuery({
    queryKey: ["settings", "home_cemetery_teaser"],
    queryFn: () => getSetting<CemeteryTeaserContent>("home_cemetery_teaser"),
  });
  const c = data ?? FALLBACK;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal
        variant="scale"
        className="grid items-center gap-8 overflow-hidden rounded-hero bg-secondary/10 p-10 md:grid-cols-2 md:p-16"
      >
        <div className="space-y-4">
          <SectionTitle
            align="left"
            eyebrow={c.eyebrow}
            title={c.title}
            description={c.description}
            className="mx-0"
          />
          <Button asChild>
            <Link to="/cemiterio">{c.cta_label || "Conhecer o Cemitério Parque"}</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
