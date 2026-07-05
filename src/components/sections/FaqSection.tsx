import { useQuery } from "@tanstack/react-query";
import { listHomeFaq } from "@/services/homeService";
import { SectionTitle } from "./SectionTitle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const { data: faqs } = useQuery({
    queryKey: ["home", "faq"],
    queryFn: listHomeFaq,
  });

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
