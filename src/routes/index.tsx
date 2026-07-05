import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Lazy loading nas páginas — ver 01-ARQUITETURA_DO_PROJETO.md > Regras.
const Home = lazy(() => import("@/pages/Home").then((m) => ({ default: m.Home })));
const Dashboard = lazy(() =>
  import("@/pages/admin/Dashboard").then((m) => ({ default: m.Dashboard })),
);

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
