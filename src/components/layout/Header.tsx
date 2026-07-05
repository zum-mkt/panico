import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Planos", to: "/planos" },
  { label: "Obituários", to: "/obituarios" },
  { label: "Cemitério", to: "/cemiterio" },
  { label: "Coroas", to: "/coroas" },
  { label: "Blog", to: "/blog" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors",
        scrolled ? "bg-background/95 shadow-sm backdrop-blur" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-heading text-xl text-primary">
          Paníco
        </Link>

        <nav className="hidden gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-foreground/80 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button asChild size="sm">
          <a href="tel:+551140000000">
            <Phone className="size-4" />
            Atendimento 24h
          </a>
        </Button>
      </div>
    </header>
  );
}
