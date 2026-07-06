import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { HeartHandshake, Phone, IdCard, ClipboardList, Flower2, MapPin } from "lucide-react";
import { getSetting } from "@/services/homeService";

type SiteSettings = { phone?: string };

export function ShortcutsBar() {
  const { data: site } = useQuery({
    queryKey: ["settings", "site"],
    queryFn: () => getSetting<SiteSettings>("site"),
  });
  const phoneHref = `tel:+55${(site?.phone ?? "1140000000").replace(/\D/g, "")}`;

  const shortcuts = [
    { label: "Obituários", to: "/obituarios", icon: HeartHandshake },
    { label: "Atendimento 24h", to: phoneHref, icon: Phone },
    { label: "Segunda Via", to: "/area-do-cliente", icon: IdCard },
    { label: "Planos", to: "/planos", icon: ClipboardList },
    { label: "Coroas", to: "/coroas", icon: Flower2 },
    { label: "Localização", to: "#localizacao", icon: MapPin },
  ];

  return (
    <div className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 px-6 py-6 md:grid-cols-6">
        {shortcuts.map(({ label, to, icon: Icon }) => {
          const isExternal = to.startsWith("tel:") || to.startsWith("#");
          const content = (
            <>
              <Icon className="size-5 text-accent" />
              <span className="text-xs text-foreground">{label}</span>
            </>
          );
          return isExternal ? (
            <a key={label} href={to} className="flex flex-col items-center gap-2 text-center">
              {content}
            </a>
          ) : (
            <Link key={label} to={to} className="flex flex-col items-center gap-2 text-center">
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
