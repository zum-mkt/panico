import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    setSubmitting(true);
    const { error } = await updatePassword(password);
    setSubmitting(false);
    if (error) setError(error);
    else setDone(true);
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-6 rounded-card border border-border bg-card p-8">
        {done ? (
          <div className="space-y-4 text-center">
            <h1 className="text-2xl text-primary">Senha atualizada</h1>
            <p className="text-sm text-secondary">Sua senha foi redefinida com sucesso.</p>
            <Button className="w-full" onClick={() => navigate("/admin", { replace: true })}>
              Ir para o admin
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1 text-center">
              <h1 className="text-2xl text-primary">Criar nova senha</h1>
              <p className="text-sm text-secondary">Escolha uma nova senha para sua conta.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input
                id="new-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Salvando…" : "Salvar nova senha"}
            </Button>
            <Link
              to="/admin/login"
              className="block text-center text-sm text-secondary underline hover:text-primary"
            >
              Voltar para o login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
