import { useQuery } from "@tanstack/react-query";
import { getSetting } from "@/services/homeService";
import { CTA } from "./CTA";

type SiteSettings = { whatsapp?: string };

export function HomeCTA() {
  const { data: site } = useQuery({
    queryKey: ["settings", "site"],
    queryFn: () => getSetting<SiteSettings>("site"),
  });

  const whatsapp = site?.whatsapp;

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <CTA
        title="Estamos aqui para ajudar, a qualquer hora"
        description="Fale agora com nossa equipe pelo telefone ou WhatsApp."
        primaryCta={
          whatsapp
            ? { label: "Falar no WhatsApp", href: `https://wa.me/${whatsapp}` }
            : { label: "Falar no WhatsApp", href: "#" }
        }
        secondaryCta={{ label: "Ligar agora", href: "tel:+551140000000" }}
      />
    </section>
  );
}
