import { cn } from "@/lib/utils";

/** Placeholder de SectionTitle enquanto a seção carrega — evita "pop-in" do conteúdo. */
export function SectionTitleSkeleton({ align = "center" }: { align?: "left" | "center" }) {
  return (
    <div className={cn("max-w-2xl animate-pulse space-y-3", align === "center" && "mx-auto text-center")}>
      <div className={cn("h-3.5 w-32 rounded-full bg-border", align === "center" && "mx-auto")} />
      <div className={cn("h-8 w-72 max-w-full rounded-full bg-border", align === "center" && "mx-auto")} />
    </div>
  );
}

/** Grade de cards placeholder — dimensões aproximadas do conteúdo real. */
export function CardGridSkeleton({
  count = 3,
  cols = "md:grid-cols-3",
}: {
  count?: number;
  cols?: string;
}) {
  return (
    <div className={cn("grid animate-pulse gap-6", cols)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-56 rounded-card bg-border/50" />
      ))}
    </div>
  );
}
