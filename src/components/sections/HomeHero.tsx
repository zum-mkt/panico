import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { HeroCta } from "./Hero";

/**
 * Hero exclusivo da Home — foto em tela cheia como plano de fundo, com
 * degradê para o texto ficar legível, em vez do formato de duas colunas
 * usado nas demais páginas (ver Hero.tsx).
 */
export function HomeHero({
  eyebrow,
  title,
  description,
  imageUrl,
  imageAlt = "",
  primaryCta,
  secondaryCta,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
}) {
  return (
    <section className="relative flex min-h-[600px] items-end overflow-hidden rounded-b-hero pt-32 pb-16 sm:min-h-[700px] sm:pb-20">
      <img
        src={imageUrl}
        alt={imageAlt}
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 z-0 size-full object-cover"
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary via-primary/75 to-primary/10" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary/95 via-primary/20 to-transparent" />

      <div
        aria-hidden
        className="absolute -top-24 -left-24 z-0 size-80 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl space-y-6"
        >
          {eyebrow && (
            <p className="text-sm font-medium tracking-wide text-accent uppercase">{eyebrow}</p>
          )}
          <h1 className="font-heading text-4xl leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-md text-lg text-primary-foreground/85">{description}</p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap gap-3 pt-2">
              {primaryCta && (
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <a
                    href={primaryCta.href}
                    {...(primaryCta.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    {primaryCta.label}
                  </a>
                </Button>
              )}
              {secondaryCta && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <a
                    href={secondaryCta.href}
                    {...(secondaryCta.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    {secondaryCta.label}
                  </a>
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
