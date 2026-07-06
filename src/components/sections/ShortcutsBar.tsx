import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSetting } from "@/services/homeService";
import { resolveIcon } from "@/lib/iconMap";

type SiteSettings = { phone?: string };
type ShortcutItem = { label: string; href: string; icon: string };

const FALLBACK_SHORTCUTS: ShortcutItem[] = [
  { label: "Obituários", href: "/obituarios", icon: "HeartHandshake" },
  { label: "Atendimento 24h", href: "tel:+551140000000", icon: "Phone" },
  { label: "Segunda Via", href: "/area-do-cliente", icon: "IdCard" },
  { label: "Planos", href: "/planos", icon: "ClipboardList" },
  { label: "Coroas", href: "/coroas", icon: "Flower2" },
  { label: "Localização", href: "#localizacao", icon: "MapPin" },
];

export function ShortcutsBar() {
  const { data: site } = useQuery({
    queryKey: ["settings", "site"],
    queryFn: () => getSetting<SiteSettings>("site"),
  });
  const { data: shortcuts } = useQuery({
    queryKey: ["settings", "home_shortcuts"],
    queryFn: () => getSetting<ShortcutItem[]>("home_shortcuts"),
  });
  const phoneHref = `tel:+55${(site?.phone ?? "1140000000").replace(/\D/g, "")}`;
  const items = (shortcuts?.length ? shortcuts : FALLBACK_SHORTCUTS).map((item) =>
    item.href.startsWith("tel:") ? { ...item, href: phoneHref } : item,
  );

  return (
    <div className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 px-6 py-6 md:grid-cols-6">
        {items.map(({ label, href, icon }) => {
          const Icon = resolveIcon(icon);
          const isExternal = href.startsWith("tel:") || href.startsWith("#");
          const content = (
            <>
              <Icon className="size-5 text-accent" />
              <span className="text-xs text-foreground">{label}</span>
            </>
          );
          return isExternal ? (
            <a key={label} href={href} className="flex flex-col items-center gap-2 text-center">
              {content}
            </a>
          ) : (
            <Link key={label} to={href} className="flex flex-col items-center gap-2 text-center">
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
