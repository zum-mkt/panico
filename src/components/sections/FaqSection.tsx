import { useQuery } from "@tanstack/react-query";
import { listHomeFaq } from "@/services/homeService";
import { SectionTitle } from "./SectionTitle";
import { SectionTitleSkeleton } from "./SectionSkeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const { data: faqs, isLoading } = useQuery({
    queryKey: ["home", "faq"],
    queryFn: listHomeFaq,
  });

  if (isLoading) {
    return (
      <section className="mx-auto max-w-3xl space-y-12 px-6 py-20">
        <SectionTitleSkeleton />
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-card bg-border/50" />
          ))}
        </div>
      </section>
    );
  }

  if (!faqs?.length) return null;

  return (
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
  );
}
