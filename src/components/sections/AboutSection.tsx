import { useQuery } from "@tanstack/react-query";
import { getSetting } from "@/services/homeService";
import { Reveal } from "@/components/ui/reveal";

type AboutContent = { title: string; text: string; image_url?: string };

export function AboutSection() {
  const { data: about } = useQuery({
    queryKey: ["settings", "about"],
    queryFn: () => getSetting<AboutContent>("about"),
  });

  if (!about) return null;

  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <Reveal className="space-y-4">
        <h2 className="font-heading text-3xl text-primary md:text-4xl">{about.title}</h2>
        <p className="text-secondary">{about.text}</p>
      </Reveal>
    </section>
  );
}
