import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Rola para o topo a cada troca de rota — SPAs não fazem isso por padrão. */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
