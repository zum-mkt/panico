import { Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <div className="flex min-h-svh bg-sidebar text-sidebar-foreground">
      <main className="flex-1 bg-background text-foreground">
        <Outlet />
      </main>
    </div>
  );
}
