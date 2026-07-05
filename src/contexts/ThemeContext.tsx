import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";

/**
 * Tokens padrão do Design System (ver 04-DESIGN_SYSTEM.md).
 * Futuramente sobrescrevíveis pela tabela `settings` do Supabase
 * (ver 18-CONFIGURACOES_GERAIS.md > Cores do tema / Fontes).
 */
export type ThemeTokens = {
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
};

const defaultTheme: ThemeTokens = {
  colors: {
    background: "#FAF8F4",
    surface: "#FFFFFF",
    primary: "#294B3D",
    secondary: "#72886C",
    accent: "#B79A5A",
    text: "#2D2D2D",
  },
  fonts: {
    heading: "'Playfair Display Variable', serif",
    body: "'Inter Variable', sans-serif",
  },
};

const ThemeContext = createContext<ThemeTokens>(defaultTheme);

export function ThemeProvider({
  theme = defaultTheme,
  children,
}: {
  theme?: ThemeTokens;
  children: ReactNode;
}) {
  const value = useMemo(() => theme, [theme]);

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--background", value.colors.background);
    root.setProperty("--card", value.colors.surface);
    root.setProperty("--popover", value.colors.surface);
    root.setProperty("--primary", value.colors.primary);
    root.setProperty("--secondary", value.colors.secondary);
    root.setProperty("--accent", value.colors.accent);
    root.setProperty("--foreground", value.colors.text);
    root.setProperty("--font-heading", value.fonts.heading);
    root.setProperty("--font-sans", value.fonts.body);
  }, [value]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
