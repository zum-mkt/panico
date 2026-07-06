import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useClientAuth } from "@/contexts/ClientAuthContext";
import { signUpClient } from "@/services/clientsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ClienteLogin() {
  const { session, signIn } = useClientAuth();
  const location = useLocation();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  if (session) {
    const from = (location.state as { from?: Location })?.from?.pathname ?? "/area-do-cliente";
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) setError(error);
      } else {
        await signUpClient(email, password);
        setSignupDone(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  if (signupDone) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-6 py-24">
        <div className="max-w-sm space-y-3 rounded-card border border-border bg-card p-8 text-center">
          <h1 className="font-heading text-xl text-primary">Confirme seu e-mail</h1>
          <p className="text-secondary">
            Enviamos um link de confirmação para {email}. Depois de confirmar, volte aqui e faça
            login para completar seu cadastro.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSignupDone(false);
              setMode("login");
            }}
          >
            Voltar ao login
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6 py-24">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-card border border-border bg-card p-8"
      >
        <div className="space-y-1 text-center">
          <h1 className="font-heading text-2xl text-primary">Área do Cliente</h1>
          <p className="text-sm text-secondary">
            {mode === "login" ? "Acesse sua conta" : "Crie sua conta"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar conta"}
        </Button>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="w-full text-center text-sm text-secondary hover:text-primary"
        >
          {mode === "login" ? "Ainda não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
      </form>
    </main>
  );
}
