import { motion, type Variants } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

const variants: Record<"fade" | "slide-up" | "scale", Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
  },
};

const tags = { div: motion.div, li: motion.li } as const;

/**
 * Scroll reveal discreto — ver 19-ANIMACOES.md.
 * Envolve qualquer seção/bloco para animar a entrada quando visível.
 * `hover` liga um leve levantamento no hover/tap, para cards e itens
 * clicáveis (também parte do conjunto de efeitos do documento).
 */
export function Reveal({
  children,
  as = "div",
  variant = "slide-up",
  delay = 0,
  hover = false,
  className,
  style,
}: {
  children: ReactNode;
  as?: keyof typeof tags;
  variant?: "fade" | "slide-up" | "scale";
  delay?: number;
  hover?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const Component = tags[as];

  return (
    <Component
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      variants={variants[variant]}
      whileHover={hover ? { y: -4, transition: { duration: 0.2, ease: "easeOut" } } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
    >
      {children}
    </Component>
  );
}
