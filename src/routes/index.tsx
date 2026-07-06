import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProtectedClientRoute } from "@/components/auth/ProtectedClientRoute";

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
const Planos = lazy(() => import("@/pages/Planos").then((m) => ({ default: m.Planos })));
const PlanosAdmin = lazy(() =>
  import("@/pages/admin/planos/PlanosAdmin").then((m) => ({ default: m.PlanosAdmin })),
);
const Coroas = lazy(() => import("@/pages/Coroas").then((m) => ({ default: m.Coroas })));
const CoroasAdmin = lazy(() =>
  import("@/pages/admin/coroas/CoroasAdmin").then((m) => ({ default: m.CoroasAdmin })),
);
const CemiterioParque = lazy(() =>
  import("@/pages/CemiterioParque").then((m) => ({ default: m.CemiterioParque })),
);
const CemiterioAdmin = lazy(() =>
  import("@/pages/admin/cemiterio/CemiterioAdmin").then((m) => ({ default: m.CemiterioAdmin })),
);
const ClienteLogin = lazy(() =>
  import("@/pages/area-cliente/ClienteLogin").then((m) => ({ default: m.ClienteLogin })),
);
const ClienteDashboard = lazy(() =>
  import("@/pages/area-cliente/ClienteDashboard").then((m) => ({ default: m.ClienteDashboard })),
);
const ClientesAdmin = lazy(() =>
  import("@/pages/admin/clientes/ClientesAdmin").then((m) => ({ default: m.ClientesAdmin })),
);
const Blog = lazy(() => import("@/pages/Blog").then((m) => ({ default: m.Blog })));
const BlogPost = lazy(() => import("@/pages/BlogPost").then((m) => ({ default: m.BlogPost })));
const BlogAdmin = lazy(() =>
  import("@/pages/admin/blog/BlogAdmin").then((m) => ({ default: m.BlogAdmin })),
);
const Contato = lazy(() => import("@/pages/Contato").then((m) => ({ default: m.Contato })));
const FormulariosAdmin = lazy(() =>
  import("@/pages/admin/formularios/FormulariosAdmin").then((m) => ({
    default: m.FormulariosAdmin,
  })),
);
const MidiaAdmin = lazy(() =>
  import("@/pages/admin/midia/MidiaAdmin").then((m) => ({ default: m.MidiaAdmin })),
);
const BannersAdmin = lazy(() =>
  import("@/pages/admin/banners/BannersAdmin").then((m) => ({ default: m.BannersAdmin })),
);
const DynamicPage = lazy(() =>
  import("@/pages/DynamicPage").then((m) => ({ default: m.DynamicPage })),
);
const PaginasAdmin = lazy(() =>
  import("@/pages/admin/paginas/PaginasAdmin").then((m) => ({ default: m.PaginasAdmin })),
);
const PageBuilder = lazy(() =>
  import("@/pages/admin/paginas/PageBuilder").then((m) => ({ default: m.PageBuilder })),
);
const UsuariosAdmin = lazy(() =>
  import("@/pages/admin/usuarios/UsuariosAdmin").then((m) => ({ default: m.UsuariosAdmin })),
);
const ConfiguracoesAdmin = lazy(() =>
  import("@/pages/admin/configuracoes/ConfiguracoesAdmin").then((m) => ({
    default: m.ConfiguracoesAdmin,
  })),
);

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/design-system" element={<DesignSystemPreview />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/obituarios" element={<Obituarios />} />
          <Route path="/obituarios/:id" element={<ObituarioDetalhe />} />
          <Route path="/cemiterio" element={<CemiterioParque />} />
          <Route path="/coroas" element={<Coroas />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/area-do-cliente/login" element={<ClienteLogin />} />
          <Route
            path="/area-do-cliente"
            element={
              <ProtectedClientRoute>
                <ClienteDashboard />
              </ProtectedClientRoute>
            }
          />
          {/* Catch-all do construtor de páginas — precisa ser a última rota pública. */}
          <Route path="/:slug" element={<DynamicPage />} />
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
          <Route path="configuracoes" element={<ConfiguracoesAdmin />} />
          <Route path="home" element={<ComingSoon title="Home" doc="05-HOME_PAGE.md" />} />
          <Route path="banners" element={<BannersAdmin />} />
          <Route path="paginas" element={<PaginasAdmin />} />
          <Route path="paginas/:id" element={<PageBuilder />} />
          <Route path="obituarios" element={<ObituariosAdmin />} />
          <Route path="planos" element={<PlanosAdmin />} />
          <Route path="coroas" element={<CoroasAdmin />} />
          <Route path="cemiterio" element={<CemiterioAdmin />} />
          <Route path="clientes" element={<ClientesAdmin />} />
          <Route
            path="parceiros"
            element={<ComingSoon title="Parceiros" doc="02-SUPABASE_E_DATABASE.md" />}
          />
          <Route path="blog" element={<BlogAdmin />} />
          <Route path="formularios" element={<FormulariosAdmin />} />
          <Route path="seo" element={<ComingSoon title="SEO" doc="12-SEO_E_MARKETING.md" />} />
          <Route path="midia" element={<MidiaAdmin />} />
          <Route path="usuarios" element={<UsuariosAdmin />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
