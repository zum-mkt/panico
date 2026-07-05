import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { adminNavItems } from "./adminNav";

export function AdminSidebar() {
  const { profile, signOut } = useAuth();

  return (
    <aside className="flex w-64 shrink-0 flex-col justify-between bg-sidebar p-4 text-sidebar-foreground">
      <div>
        <div className="mb-6 px-2">
          <p className="font-heading text-lg">Paníco</p>
          <p className="text-xs text-sidebar-foreground/60">Painel administrativo</p>
        </div>

        <nav className="space-y-1">
          {adminNavItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="space-y-2 px-2">
        {profile && (
          <p className="truncate text-xs text-sidebar-foreground/60">{profile.email}</p>
        )}
        <button
          type="button"
          onClick={() => signOut()}
          className="flex items-center gap-2 text-sm text-sidebar-foreground/80 hover:text-sidebar-foreground"
        >
          <LogOut className="size-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
