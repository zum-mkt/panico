import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import { listScheduledBanners } from "@/services/bannersService";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

/**
 * Exibe banners ativos e dentro do agendamento — ver
 * 15-SISTEMA_DE_BANNERS.md. Imagens responsivas por breakpoint via
 * <picture>; roda em carrossel quando há mais de um banner.
 */
export function BannerDisplay() {
  const { data: banners } = useQuery({
    queryKey: ["banners", "public"],
    queryFn: listScheduledBanners,
  });

  const autoplay = useRef(Autoplay({ delay: 6000, stopOnInteraction: false }));

  if (!banners?.length) return null;

  return (
    <Carousel
      opts={{ loop: banners.length > 1 }}
      plugins={[autoplay.current]}
      className="mx-auto max-w-6xl px-6 pt-6"
    >
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.id}>
            <div className="relative overflow-hidden rounded-card">
              <picture>
                {banner.image_mobile_url && (
                  <source media="(max-width: 640px)" srcSet={banner.image_mobile_url} />
                )}
                {banner.image_tablet_url && (
                  <source media="(max-width: 1024px)" srcSet={banner.image_tablet_url} />
                )}
                <img
                  src={banner.image_desktop_url ?? banner.image_tablet_url ?? banner.image_mobile_url ?? ""}
                  alt={banner.title ?? ""}
                  width={1600}
                  height={686}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[21/9] w-full object-cover"
                />
              </picture>
              {(banner.title || banner.cta_label) && (
                <div className="absolute inset-0 flex flex-col items-start justify-end gap-2 bg-gradient-to-t from-black/50 to-transparent p-6">
                  {banner.title && (
                    <p className="font-heading text-xl text-white">{banner.title}</p>
                  )}
                  {banner.cta_label && banner.link_url && (
                    <Button asChild size="sm">
                      <a href={banner.link_url}>{banner.cta_label}</a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {banners.length > 1 && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
}
