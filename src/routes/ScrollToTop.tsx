import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Rola para o topo a cada troca de rota — SPAs não fazem isso por padrão.
 * Quando a navegação inclui uma âncora (#id), rola até o elemento assim que
 * ele existir no DOM — o conteúdo da página costuma vir de dados assíncronos.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = hash.slice(1);
    let attempts = 0;
    let frame: number;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempts < 30) {
        attempts += 1;
        frame = requestAnimationFrame(tryScroll);
      }
    };
    tryScroll();
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}
