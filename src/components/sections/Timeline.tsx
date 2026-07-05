import { Reveal } from "@/components/ui/reveal";

export type TimelineItem = {
  title: string;
  description?: string;
  date?: string;
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative space-y-10 border-l border-border pl-8">
      {items.map((item, i) => (
        <Reveal key={i} as="li" delay={i * 0.08} className="relative">
          <span className="absolute -left-[calc(2rem+5px)] top-1 size-2.5 rounded-full bg-accent" />
          {item.date && <p className="text-sm text-accent">{item.date}</p>}
          <h3 className="font-heading text-lg text-primary">{item.title}</h3>
          {item.description && <p className="text-secondary">{item.description}</p>}
        </Reveal>
      ))}
    </ol>
  );
}
