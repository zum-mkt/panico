import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

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
 */
export function Reveal({
  children,
  as = "div",
  variant = "slide-up",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: keyof typeof tags;
  variant?: "fade" | "slide-up" | "scale";
  delay?: number;
  className?: string;
}) {
  const Component = tags[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      variants={variants[variant]}
    >
      {children}
    </Component>
  );
}
