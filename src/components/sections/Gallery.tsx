import { Reveal } from "@/components/ui/reveal";

export type GalleryImage = {
  src: string;
  alt: string;
};

export function Gallery({ images, columns = 3 }: { images: GalleryImage[]; columns?: 2 | 3 | 4 }) {
  const colsClass = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" }[columns];

  return (
    <div className={`grid grid-cols-2 gap-4 ${colsClass}`}>
      {images.map((image, i) => (
        <Reveal key={image.src} variant="scale" delay={i * 0.05} className="overflow-hidden rounded-card">
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </Reveal>
      ))}
    </div>
  );
}
