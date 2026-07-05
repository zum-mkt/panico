import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MapPin, Phone } from "lucide-react";
import { getSetting } from "@/services/homeService";

type SiteSettings = {
  phone?: string;
  whatsapp?: string;
  address?: string;
  instagram?: string;
  facebook?: string;
};

export function Footer() {
  const { data: site } = useQuery({
    queryKey: ["settings", "site"],
    queryFn: () => getSetting<SiteSettings>("site"),
  });

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <p className="font-heading text-xl">Paníco</p>
          <p className="mt-2 text-sm text-primary-foreground/70">
            Acolhimento, respeito e tradição em cada momento.
          </p>
        </div>

        <div className="space-y-2 text-sm text-primary-foreground/80">
          {site?.phone && (
            <p className="flex items-center gap-2">
              <Phone className="size-4" /> {site.phone}
            </p>
          )}
          {site?.address && (
            <p className="flex items-center gap-2">
              <MapPin className="size-4" /> {site.address}
            </p>
          )}
        </div>

        <div className="flex gap-4 text-sm">
          {site?.instagram && (
            <a href={site.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
          {site?.facebook && (
            <a href={site.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 px-6 py-4 text-center text-xs text-primary-foreground/60">
        <Link to="/admin">© {new Date().getFullYear()} Funerária Paníco</Link>
      </div>
    </footer>
  );
}
