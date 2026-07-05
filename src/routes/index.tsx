import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Lazy loading nas páginas — ver 01-ARQUITETURA_DO_PROJETO.md > Regras.
const Home = lazy(() => import("@/pages/Home").then((m) => ({ default: m.Home })));
const Login = lazy(() => import("@/pages/admin/Login").then((m) => ({ default: m.Login })));
const Dashboard = lazy(() =>
  import("@/pages/admin/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const ComingSoon = lazy(() =>
  import("@/pages/ComingSoon").then((m) => ({ default: m.ComingSoon })),
);
const DesignSystemPreview = lazy(() =>
  import("@/pages/DesignSystemPreview").then((m) => ({ default: m.DesignSystemPreview })),
);
const Obituarios = lazy(() =>
  import("@/pages/Obituarios").then((m) => ({ default: m.Obituarios })),
);
const ObituarioDetalhe = lazy(() =>
  import("@/pages/ObituarioDetalhe").then((m) => ({ default: m.ObituarioDetalhe })),
);
const ObituariosAdmin = lazy(() =>
  import("@/pages/admin/obituarios/ObituariosAdmin").then((m) => ({
    default: m.ObituariosAdmin,
  })),
);

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/design-system" element={<DesignSystemPreview />} />
          <Route
            path="/planos"
            element={<ComingSoon title="Planos" doc="07-PLANOS_FUNERARIOS.md" />}
          />
          <Route path="/obituarios" element={<Obituarios />} />
          <Route path="/obituarios/:id" element={<ObituarioDetalhe />} />
          <Route
            path="/cemiterio"
            element={<ComingSoon title="Cemitério Parque" doc="09-CEMITERIO_PARQUE.md" />}
          />
          <Route path="/coroas" element={<ComingSoon title="Coroas" doc="08-COROAS.md" />} />
          <Route path="/blog" element={<ComingSoon title="Blog" doc="11-BLOG.md" />} />
          <Route
            path="/area-do-cliente"
            element={<ComingSoon title="Área do Cliente" doc="10-AREA_DO_CLIENTE.md" />}
          />
        </Route>

        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route
            path="configuracoes"
            element={<ComingSoon title="Configurações" doc="18-CONFIGURACOES_GERAIS.md" />}
          />
          <Route path="home" element={<ComingSoon title="Home" doc="05-HOME_PAGE.md" />} />
          <Route
            path="paginas"
            element={<ComingSoon title="Páginas" doc="16-CONSTRUTOR_DE_PAGINAS.md" />}
          />
          <Route path="obituarios" element={<ObituariosAdmin />} />
          <Route
            path="planos"
            element={<ComingSoon title="Planos" doc="07-PLANOS_FUNERARIOS.md" />}
          />
          <Route path="coroas" element={<ComingSoon title="Coroas" doc="08-COROAS.md" />} />
          <Route
            path="cemiterio"
            element={<ComingSoon title="Cemitério" doc="09-CEMITERIO_PARQUE.md" />}
          />
          <Route
            path="parceiros"
            element={<ComingSoon title="Parceiros" doc="02-SUPABASE_E_DATABASE.md" />}
          />
          <Route path="blog" element={<ComingSoon title="Blog" doc="11-BLOG.md" />} />
          <Route path="seo" element={<ComingSoon title="SEO" doc="12-SEO_E_MARKETING.md" />} />
          <Route
            path="midia"
            element={<ComingSoon title="Biblioteca de mídia" doc="14-BIBLIOTECA_DE_MIDIA.md" />}
          />
          <Route
            path="usuarios"
            element={<ComingSoon title="Usuários" doc="17-USUARIOS_E_PERMISSOES.md" />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
}
