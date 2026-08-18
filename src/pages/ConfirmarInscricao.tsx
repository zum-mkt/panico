import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { confirmSubscription } from "@/services/notificationSubscribersService";
import { Reveal } from "@/components/ui/reveal";
import { PageLoader } from "@/components/ui/page-loader";
import { Button } from "@/components/ui/button";

export function ConfirmarInscricao() {
  const { token } = useParams<{ token: string }>();
  const { data: confirmed, isLoading } = useQuery({
    queryKey: ["notification-subscribers", "confirm", token],
    queryFn: () => confirmSubscription(token!),
    enabled: !!token,
    retry: false,
  });

  if (isLoading) return <PageLoader />;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 py-24 text-center">
      <Seo title="Confirmar inscrição" description="Confirme sua inscrição para receber avisos de novos obituários." />
      <Reveal className="space-y-4">
        {confirmed ? (
          <>
            <CheckCircle2 className="mx-auto size-10 text-accent" />
            <h1 className="font-heading text-2xl text-primary">Inscrição confirmada</h1>
            <p className="text-secondary">
              A partir de agora você vai receber um e-mail sempre que um novo obituário for publicado.
            </p>
          </>
        ) : (
          <>
            <XCircle className="mx-auto size-10 text-secondary" />
            <h1 className="font-heading text-2xl text-primary">Link inválido ou expirado</h1>
            <p className="text-secondary">
              Não conseguimos confirmar essa inscrição. Se você já confirmou antes, não precisa fazer
              nada — ou cadastre-se novamente na home.
            </p>
          </>
        )}
        <Button asChild>
          <Link to="/obituarios">Ver obituários</Link>
        </Button>
      </Reveal>
    </main>
  );
}
