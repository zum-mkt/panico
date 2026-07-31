import { motion } from "framer-motion";

/** Fallback leve para Suspense — evita tela em branco durante o download do chunk da rota. */
export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <motion.div
        aria-label="Carregando"
        role="status"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="size-8 animate-spin rounded-full border-2 border-border border-t-accent"
      />
    </div>
  );
}
