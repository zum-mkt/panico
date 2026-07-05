import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout() {
  return (
    <div className="flex min-h-svh">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-background text-foreground">
        <Outlet />
      </main>
    </div>
  );
}
