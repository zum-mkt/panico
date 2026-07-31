import { useQuery } from "@tanstack/react-query";
import { getSetting } from "@/services/homeService";
import { Reveal } from "@/components/ui/reveal";

type AboutContent = { title: string; text: string; image_url?: string };

export function AboutSection() {
  const { data: about, isLoading } = useQuery({
    queryKey: ["settings", "about"],
    queryFn: () => getSetting<AboutContent>("about"),
  });

  if (isLoading) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="mx-auto animate-pulse space-y-4">
          <div className="mx-auto h-9 w-64 max-w-full rounded-full bg-border" />
          <div className="mx-auto h-4 w-full rounded-full bg-border/60" />
          <div className="mx-auto h-4 w-5/6 rounded-full bg-border/60" />
          <div className="mx-auto h-4 w-2/3 rounded-full bg-border/60" />
        </div>
      </section>
    );
  }

  if (!about) return null;

  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <Reveal className="space-y-4">
        <h2 className="font-heading text-3xl text-primary md:text-4xl">{about.title}</h2>
        {about.text.split("\n").filter(Boolean).map((paragraph, i) => (
          <p key={i} className="text-secondary">
            {paragraph}
          </p>
        ))}
      </Reveal>
    </section>
  );
}
