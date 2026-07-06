import { useQuery } from "@tanstack/react-query";
import { getSetting } from "@/services/homeService";
import { CTA } from "./CTA";

type SiteSettings = { whatsapp?: string; phone?: string };
type CtaContent = { title: string; description: string };

const FALLBACK_CTA: CtaContent = {
  title: "Estamos aqui para ajudar, a qualquer hora",
  description: "Fale agora com nossa equipe pelo telefone ou WhatsApp.",
};

export function HomeCTA() {
  const { data: site } = useQuery({
    queryKey: ["settings", "site"],
    queryFn: () => getSetting<SiteSettings>("site"),
  });
  const { data: cta } = useQuery({
    queryKey: ["settings", "home_cta"],
    queryFn: () => getSetting<CtaContent>("home_cta"),
  });

  const whatsapp = site?.whatsapp;
  const phoneHref = `tel:+55${(site?.phone ?? "1140000000").replace(/\D/g, "")}`;
  const c = cta ?? FALLBACK_CTA;

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <CTA
        title={c.title}
        description={c.description}
        primaryCta={
          whatsapp
            ? { label: "Falar no WhatsApp", href: `https://wa.me/${whatsapp}` }
            : { label: "Falar no WhatsApp", href: "#" }
        }
        secondaryCta={{ label: "Ligar agora", href: phoneHref }}
      />
    </section>
  );
}
