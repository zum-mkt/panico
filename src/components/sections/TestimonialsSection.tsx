import { useQuery } from "@tanstack/react-query";
import { listActiveTestimonials } from "@/services/homeService";
import { SectionTitle } from "./SectionTitle";
import { SectionTitleSkeleton, CardGridSkeleton } from "./SectionSkeleton";
import { Testimonial } from "./Testimonial";

export function TestimonialsSection() {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["home", "testimonials"],
    queryFn: listActiveTestimonials,
  });

  if (isLoading) {
    return (
      <section className="mx-auto max-w-6xl space-y-12 px-6 py-20">
        <SectionTitleSkeleton />
        <CardGridSkeleton count={3} cols="md:grid-cols-3" />
      </section>
    );
  }

  if (!testimonials?.length) return null;

  return (
    <section className="mx-auto max-w-6xl space-y-12 px-6 py-20">
      <SectionTitle eyebrow="Depoimentos" title="Quem confia na Paníco" />
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <Testimonial
            key={t.id}
            authorName={t.author_name}
            authorPhotoUrl={t.author_photo_url}
            content={t.content}
            rating={t.rating}
          />
        ))}
      </div>
    </section>
  );
}
