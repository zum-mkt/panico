import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/supabase/client";

/**
 * Tokens padrão do Design System (ver 04-DESIGN_SYSTEM.md).
 * Sobrescrevíveis pela tabela `settings` (key = 'theme') — ver
 * 18-CONFIGURACOES_GERAIS.md > Cores do tema / Fontes.
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

export const defaultTheme: ThemeTokens = {
  colors: {
    background: "#F5F6F8",
    surface: "#FFFFFF",
    primary: "#16283D",
    secondary: "#4F6478",
    accent: "#2F6690",
    text: "#1E2226",
  },
  fonts: {
    heading: "'Playfair Display Variable', serif",
    body: "'Inter Variable', sans-serif",
  },
};

const ThemeContext = createContext<ThemeTokens>(defaultTheme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeTokens>(defaultTheme);

  useEffect(() => {
    supabase
      .from("settings")
      .select("value")
      .eq("key", "theme")
      .maybeSingle()
      .then(({ data }) => {
        const override = data?.value as Partial<ThemeTokens> | undefined;
        if (!override) return;
        setTheme({
          colors: { ...defaultTheme.colors, ...override.colors },
          fonts: { ...defaultTheme.fonts, ...override.fonts },
        });
      });
  }, []);

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
