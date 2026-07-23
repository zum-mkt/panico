import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSetting } from "@/services/homeService";
import { cn } from "@/lib/utils";

const links = [
  { label: "Planos", to: "/planos" },
  { label: "Obituários", to: "/obituarios" },
  { label: "Cemitério", to: "/cemiterio" },
  { label: "Coroas", to: "/coroas" },
  { label: "Blog", to: "/blog" },
  { label: "Contato", to: "/contato" },
];

type SiteSettings = { phone?: string; logo_url?: string };

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { data: site } = useQuery({
    queryKey: ["settings", "site"],
    queryFn: () => getSetting<SiteSettings>("site"),
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const phone = site?.phone ?? "(11) 4000-0000";
  const phoneHref = `tel:+55${phone.replace(/\D/g, "")}`;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors",
        isHome
          ? "bg-primary shadow-sm"
          : scrolled
            ? "bg-background/95 shadow-sm backdrop-blur"
            : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center font-heading text-xl text-primary">
          {site?.logo_url ? (
            <span
              className={cn(
                "flex items-center rounded-lg px-3 py-1.5 transition-colors",
                isHome && "bg-white",
              )}
            >
              <img src={site.logo_url} alt="Paníco" className="h-11 w-auto object-contain" />
            </span>
          ) : (
            <span className={isHome ? "text-primary-foreground" : "text-primary"}>Paníco</span>
          )}
        </Link>

        <nav className="hidden gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "text-sm transition-colors",
                isHome
                  ? "text-primary-foreground/75 hover:text-primary-foreground"
                  : "text-foreground/80 hover:text-primary",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button
          asChild
          size="sm"
          className={cn(isHome && "bg-white text-primary hover:bg-white/90")}
        >
          <a href={phoneHref}>
            <Phone className="size-4" />
            Atendimento 24h
          </a>
        </Button>
      </div>
    </header>
  );
}
