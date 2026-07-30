import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * O link de recuperação de senha do Supabase às vezes cai na URL base do site
 * (quando a URL de redirect não está na allow-list do projeto), em vez de
 * /admin/redefinir-senha — mas o hash com o token de recovery continua na URL.
 * Detecta isso em qualquer página e redireciona preservando o hash.
 */
export function AuthRecoveryRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    if (
      window.location.hash.includes("type=recovery") &&
      window.location.pathname !== "/admin/redefinir-senha"
    ) {
      navigate(`/admin/redefinir-senha${window.location.hash}`, { replace: true });
    }
  }, [navigate]);

  return null;
}
