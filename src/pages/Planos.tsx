import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { useSeoPage } from "@/hooks/useSeoPage";
import { listPublicPlans } from "@/services/plansService";
import { getSetting } from "@/services/homeService";
import { supabase } from "@/supabase/client";
import { Hero } from "@/components/sections/Hero";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { CTA } from "@/components/sections/CTA";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { resolveIcon } from "@/lib/iconMap";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

type PlansBenefit = { icon?: string; title: string; description?: string };

async function listPlansFaq() {
  const { data } = await supabase
    .from("faq")
    .select("id, question, answer")
    .eq("is_active", true)
    .eq("context", "planos")
    .order("position");
  return data ?? [];
}

export function Planos() {
  const { data: plans } = useQuery({ queryKey: ["plans", "public"], queryFn: listPublicPlans });
  const { data: benefits } = useQuery({
    queryKey: ["settings", "plans_benefits"],
    queryFn: () => getSetting<PlansBenefit[]>("plans_benefits"),
  });
  const { data: faqs } = useQuery({ queryKey: ["plans", "faq"], queryFn: listPlansFaq });

  const allBenefits = useMemo(() => {
    const set = new Set<string>();
    plans?.forEach((p) => p.benefits.forEach((b) => set.add(b)));
    return Array.from(set);
  }, [plans]);
  const seo = useSeoPage("planos", {
    title: "Planos Funerários",
    description:
      "Conheça os planos funerários da Paníco: assistência 24h, sem burocracia e com cobertura para toda a família.",
  });

  return (
    <main>
      <Seo title={seo.title} description={seo.description} />

      <Hero
        eyebrow="Planos"
        title="Proteção completa para você e sua família"
        description="Planos funerários com assistência 24h, sem burocracia na hora em que sua família mais precisa."
        imageUrl="/hero-placeholder.svg"
        primaryCta={{ label: "Falar com a equipe", href: "tel:+551140000000" }}
      />

      {!!benefits?.length && (
        <section className="mx-auto max-w-6xl space-y-12 px-6 py-20">
          <SectionTitle eyebrow="Por que contratar" title="Benefícios" />
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {benefits.map((b, i) => {
              const Icon = resolveIcon(b.icon);
              return (
                <Reveal key={b.title} delay={i * 0.06} className="space-y-2 text-center">
                  <Icon className="mx-auto size-6 text-accent" />
                  <h3 className="font-heading text-lg text-primary">{b.title}</h3>
                  {b.description && <p className="text-sm text-secondary">{b.description}</p>}
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {!!plans?.length && (
        <section className="mx-auto max-w-6xl space-y-12 px-6 py-20">
          <SectionTitle eyebrow="Escolha o seu" title="Nossos planos" />
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
                style={plan.color && !plan.is_featured ? { borderColor: plan.color } : undefined}
              >
                <h3 className="font-heading text-xl">{plan.title}</h3>
                {plan.description && (
                  <p
                    className={cn(
                      "text-sm",
                      plan.is_featured ? "text-primary-foreground/80" : "text-secondary",
                    )}
                  >
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
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2">
                      <Check className="size-4 text-accent" /> {benefit}
                    </li>
                  ))}
                </ul>
                <Button asChild variant={plan.is_featured ? "secondary" : "default"}>
                  <a href={plan.cta_url || "tel:+551140000000"}>
                    {plan.cta_label || "Contratar"}
                  </a>
                </Button>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {!!plans?.length && allBenefits.length > 0 && (
        <section className="mx-auto max-w-6xl space-y-12 px-6 py-20">
          <SectionTitle eyebrow="Compare" title="Comparativo de planos" />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="p-3 text-left"></th>
                  {plans.map((p) => (
                    <th key={p.id} className="p-3 text-center font-heading text-primary">
                      {p.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allBenefits.map((benefit) => (
                  <tr key={benefit} className="border-t border-border">
                    <td className="p-3">{benefit}</td>
                    {plans.map((p) => (
                      <td key={p.id} className="p-3 text-center">
                        {p.benefits.includes(benefit) ? (
                          <Check className="mx-auto size-4 text-accent" />
                        ) : (
                          <X className="mx-auto size-4 text-border" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {!!faqs?.length && (
        <section className="mx-auto max-w-3xl space-y-12 px-6 py-20">
          <SectionTitle eyebrow="Dúvidas" title="Perguntas frequentes" />
          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <CTA
          title="Ainda tem dúvidas sobre qual plano escolher?"
          description="Fale com nossa equipe e encontre o plano ideal para sua família."
          primaryCta={{ label: "Falar no WhatsApp", href: "https://wa.me/5511900000000" }}
        />
      </section>
    </main>
  );
}
