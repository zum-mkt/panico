import { Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Outlet />
    </div>
  );
}
