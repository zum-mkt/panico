import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSetting } from "@/services/homeService";
import { listMenuPages } from "@/services/pagesService";

const institutionalLinks = [
  { label: "Planos", to: "/planos" },
  { label: "Obituários", to: "/obituarios" },
  { label: "Cemitério", to: "/cemiterio" },
  { label: "Coroas", to: "/coroas" },
  { label: "Blog", to: "/blog" },
  { label: "Contato", to: "/contato" },
];

type SiteSettings = { phone?: string; logo_url?: string };

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { data: site } = useQuery({
    queryKey: ["settings", "site"],
    queryFn: () => getSetting<SiteSettings>("site"),
  });
  const { data: menuPages } = useQuery({
    queryKey: ["pages", "menu"],
    queryFn: listMenuPages,
  });

  const links = [
    ...institutionalLinks,
    ...(menuPages ?? []).map((page) => ({
      label: page.menu_label || page.title,
      to: `/${page.slug}`,
    })),
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const phone = site?.phone ?? "(11) 4000-0000";
  const phoneHref = `tel:+55${phone.replace(/\D/g, "")}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-primary shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center font-heading text-xl text-primary">
          {site?.logo_url ? (
            <span className="flex items-center rounded-lg bg-white px-3 py-1.5">
              <img src={site.logo_url} alt="Paníco" className="h-11 w-auto object-contain" />
            </span>
          ) : (
            <span className="text-primary-foreground">Paníco</span>
          )}
        </Link>

        <nav className="hidden gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="bg-white text-primary hover:bg-white/90">
            <a href={phoneHref}>
              <Phone className="size-4" />
              <span className="hidden sm:inline">Atendimento 24h</span>
            </a>
          </Button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            className="flex size-9 items-center justify-center rounded-full text-primary-foreground md:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 pb-6">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="rounded-lg px-3 py-2.5 text-sm text-foreground/80 hover:bg-muted hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
