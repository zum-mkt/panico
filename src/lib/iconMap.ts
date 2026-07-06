import {
  Church,
  Flower2,
  Truck,
  ShieldCheck,
  HeartHandshake,
  FileText,
  Phone,
  MapPin,
  IdCard,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

// Nomes de ícone armazenados no banco (campo `icon`) mapeados para Lucide —
// ver 04-DESIGN_SYSTEM.md > Ícones: nunca misturar bibliotecas.
const iconMap: Record<string, LucideIcon> = {
  Church,
  Flower2,
  Truck,
  ShieldCheck,
  HeartHandshake,
  FileText,
  Phone,
  MapPin,
  IdCard,
  ClipboardList,
};

export const iconNames = Object.keys(iconMap);

export function resolveIcon(name?: string | null): LucideIcon {
  return (name && iconMap[name]) || HeartHandshake;
}
