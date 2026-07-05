import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { listActivePlans } from "@/services/homeService";
import { SectionTitle } from "./SectionTitle";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function PlansSection() {
  const { data: plans } = useQuery({
    queryKey: ["home", "plans"],
    queryFn: listActivePlans,
  });

  if (!plans?.length) return null;

  return (
    <section className="mx-auto max-w-6xl space-y-12 px-6 py-20">
      <SectionTitle eyebrow="Planos" title="Proteção para sua família" />
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, i) => (
          <Reveal
            key={plan.id}
            delay={i * 0.08}
            className={cn(
              "flex flex-col gap-4 rounded-card border p-8",
              plan.is_featured
                ? "border-accent bg-primary text-primary-foreground"
                : "border-border bg-card",
            )}
          >
            <h3 className="font-heading text-xl">{plan.title}</h3>
            {plan.description && (
              <p className={cn("text-sm", plan.is_featured ? "text-primary-foreground/80" : "text-secondary")}>
                {plan.description}
              </p>
            )}
            {plan.price != null && (
              <p className="text-3xl">
                {currency.format(plan.price)}
                <span className="text-sm font-normal">/mês</span>
              </p>
            )}
            <ul className="flex-1 space-y-2 text-sm">
              {((plan.benefits as string[]) ?? []).map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <Check className="size-4 text-accent" /> {benefit}
                </li>
              ))}
            </ul>
            <Button variant={plan.is_featured ? "secondary" : "default"} className="w-full">
              Contratar
            </Button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
