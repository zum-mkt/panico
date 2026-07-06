import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Settings,
  Home,
  FileText,
  HeartHandshake,
  ClipboardList,
  Flower2,
  TreePine,
  Handshake,
  Newspaper,
  Search,
  Image,
  Users,
  IdCard,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

// Módulos definidos em 03-ADMIN_CMS.md
export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Configurações", to: "/admin/configuracoes", icon: Settings },
  { label: "Home", to: "/admin/home", icon: Home },
  { label: "Páginas", to: "/admin/paginas", icon: FileText },
  { label: "Obituários", to: "/admin/obituarios", icon: HeartHandshake },
  { label: "Planos", to: "/admin/planos", icon: ClipboardList },
  { label: "Coroas", to: "/admin/coroas", icon: Flower2 },
  { label: "Cemitério", to: "/admin/cemiterio", icon: TreePine },
  { label: "Clientes", to: "/admin/clientes", icon: IdCard },
  { label: "Parceiros", to: "/admin/parceiros", icon: Handshake },
  { label: "Blog", to: "/admin/blog", icon: Newspaper },
  { label: "SEO", to: "/admin/seo", icon: Search },
  { label: "Biblioteca de mídia", to: "/admin/midia", icon: Image },
  { label: "Usuários", to: "/admin/usuarios", icon: Users },
];
