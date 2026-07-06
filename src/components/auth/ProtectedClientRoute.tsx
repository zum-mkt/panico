import { Navigate, useLocation } from "react-router-dom";
import { useClientAuth } from "@/contexts/ClientAuthContext";

export function ProtectedClientRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useClientAuth();
  const location = useLocation();

  if (loading) return null;

  if (!session) {
    return <Navigate to="/area-do-cliente/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
