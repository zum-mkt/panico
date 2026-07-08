import { useQuery } from "@tanstack/react-query";
import { getSetting } from "@/services/homeService";
import { Seo } from "@/components/seo/Seo";
import { useSeoPage } from "@/hooks/useSeoPage";
import { Hero } from "@/components/sections/Hero";
import { BannerDisplay } from "@/components/sections/BannerDisplay";
import { ShortcutsBar } from "@/components/sections/ShortcutsBar";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { PlansSection } from "@/components/sections/PlansSection";
import { ObituariesSection } from "@/components/sections/ObituariesSection";
import { CemeteryTeaserSection } from "@/components/sections/CemeteryTeaserSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HomeCTA } from "@/components/sections/HomeCTA";

type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  image_url: string;
  primary_label: string;
  primary_href: string;
  secondary_label: string;
  secondary_href: string;
};

const FALLBACK_HERO: HeroContent = {
  eyebrow: "Funerária Paníco",
  title: "Cuidado, respeito e acolhimento em cada momento",
  description: "Estamos ao seu lado com serenidade e profissionalismo, 24 horas por dia.",
  image_url: "/hero-placeholder.svg",
  primary_label: "Ver planos",
  primary_href: "/planos",
  secondary_label: "Atendimento 24h",
  secondary_href: "tel:+551140000000",
};

// Ordem das seções — ver 05-HOME_PAGE.md (Header e Footer ficam no PublicLayout).
export function Home() {
  const { data: hero } = useQuery({
    queryKey: ["settings", "home_hero"],
    queryFn: () => getSetting<HeroContent>("home_hero"),
  });
  const h = hero ?? FALLBACK_HERO;
  const seo = useSeoPage("home", {
    title: "Cuidado, respeito e acolhimento em cada momento",
    description:
      "Funerária Paníco: planos funerários, obituários, cemitério parque e atendimento 24h com serenidade e profissionalismo.",
  });

  return (
    <main>
      <Seo title={seo.title} description={seo.description} />
      <Hero
        eyebrow={h.eyebrow}
        title={h.title}
        description={h.description}
        imageUrl={h.image_url || "/hero-placeholder.svg"}
        primaryCta={h.primary_label ? { label: h.primary_label, href: h.primary_href || "#" } : undefined}
        secondaryCta={
          h.secondary_label ? { label: h.secondary_label, href: h.secondary_href || "#" } : undefined
        }
      />
      <ShortcutsBar />
      <BannerDisplay />
      <ServicesSection />
      <AboutSection />
      <PlansSection />
      <ObituariesSection />
      <CemeteryTeaserSection />
      <PartnersSection />
      <TestimonialsSection />
      <FaqSection />
      <HomeCTA />
    </main>
  );
}
