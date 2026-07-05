import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import type { HeroCta } from "./Hero";

export function CTA({
  title,
  description,
  primaryCta,
  secondaryCta,
}: {
  title: string;
  description?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
}) {
  return (
    <Reveal variant="fade" className="rounded-hero bg-primary px-8 py-16 text-center">
      <div className="mx-auto max-w-xl space-y-6">
        <h2 className="font-heading text-3xl text-primary-foreground md:text-4xl">{title}</h2>
        {description && <p className="text-primary-foreground/80">{description}</p>}
        {(primaryCta || secondaryCta) && (
          <div className="flex flex-wrap justify-center gap-3">
            {primaryCta && (
              <Button asChild size="lg" variant="secondary">
                <a href={primaryCta.href}>{primaryCta.label}</a>
              </Button>
            )}
            {secondaryCta && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <a href={secondaryCta.href}>{secondaryCta.label}</a>
              </Button>
            )}
          </div>
        )}
      </div>
    </Reveal>
  );
}
