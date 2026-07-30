import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await resetPassword(email);
    if (error) setError(error);
    else setSent(true);
    setSubmitting(false);
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-secondary">
          Se houver uma conta com o e-mail <strong>{email}</strong>, enviamos um link para
          redefinir a senha. Verifique sua caixa de entrada (e o spam).
        </p>
        <Button type="button" variant="outline" className="w-full" onClick={onBack}>
          Voltar para o login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl text-primary">Redefinir senha</h1>
        <p className="text-sm text-secondary">
          Informe seu e-mail e enviaremos um link para criar uma nova senha.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-email">E-mail</Label>
        <Input
          id="reset-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Enviando…" : "Enviar link de redefinição"}
      </Button>
      <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
        Voltar para o login
      </Button>
    </form>
  );
}

export function Login() {
  const { session, signIn } = useAuth();
  const location = useLocation();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (session) {
    const from = (location.state as { from?: Location })?.from?.pathname ?? "/admin";
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setSubmitting(false);
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-6 rounded-card border border-border bg-card p-8">
        {mode === "forgot" ? (
          <ForgotPasswordForm onBack={() => setMode("login")} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1 text-center">
              <h1 className="text-2xl text-primary">Paníco Admin</h1>
              <p className="text-sm text-secondary">Acesso restrito à equipe</p>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Entrando…" : "Entrar"}
            </Button>
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="w-full text-center text-sm text-secondary underline hover:text-primary"
            >
              Esqueci minha senha
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
