import { Seo } from "@/components/seo/Seo";
import { Hero } from "@/components/sections/Hero";
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

// Ordem das seções — ver 05-HOME_PAGE.md (Header e Footer ficam no PublicLayout).
export function Home() {
  return (
    <main>
      <Seo
        title="Cuidado, respeito e acolhimento em cada momento"
        description="Funerária Paníco: planos funerários, obituários, cemitério parque e atendimento 24h com serenidade e profissionalismo."
      />
      <Hero
        eyebrow="Funerária Paníco"
        title="Cuidado, respeito e acolhimento em cada momento"
        description="Estamos ao seu lado com serenidade e profissionalismo, 24 horas por dia."
        imageUrl="/hero-placeholder.svg"
        primaryCta={{ label: "Ver planos", href: "/planos" }}
        secondaryCta={{ label: "Atendimento 24h", href: "tel:+551140000000" }}
      />
      <ShortcutsBar />
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
