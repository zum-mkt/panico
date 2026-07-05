import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl space-y-3",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-sm font-medium tracking-wide text-accent uppercase">{eyebrow}</p>
      )}
      <h2 className="font-heading text-3xl text-primary md:text-4xl">{title}</h2>
      {description && <p className="text-secondary">{description}</p>}
    </Reveal>
  );
}
