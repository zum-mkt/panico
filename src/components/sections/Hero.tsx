import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export type HeroCta = {
  label: string;
  href: string;
};

export function Hero({
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
    <section className="relative overflow-hidden bg-background">
      <div
        aria-hidden
        className="absolute -top-32 -left-32 size-96 rounded-full bg-accent/10 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-24 top-40 size-80 rounded-full bg-secondary/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6"
        >
          {eyebrow && (
            <p className="text-sm font-medium tracking-wide text-accent uppercase">{eyebrow}</p>
          )}
          <h1 className="font-heading text-4xl leading-tight text-primary md:text-5xl">
            {title}
          </h1>
          {description && <p className="max-w-md text-lg text-secondary">{description}</p>}

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap gap-3 pt-2">
              {primaryCta && (
                <Button asChild size="lg">
                  <a href={primaryCta.href}>{primaryCta.label}</a>
                </Button>
              )}
              {secondaryCta && (
                <Button asChild variant="outline" size="lg">
                  <a href={secondaryCta.href}>{secondaryCta.label}</a>
                </Button>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="overflow-hidden rounded-hero"
        >
          <img
            src={imageUrl}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
