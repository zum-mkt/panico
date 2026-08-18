import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { unsubscribeNotification } from "@/services/notificationSubscribersService";
import { Reveal } from "@/components/ui/reveal";
import { PageLoader } from "@/components/ui/page-loader";
import { Button } from "@/components/ui/button";

export function Desinscricao() {
  const { token } = useParams<{ token: string }>();
  const { data: unsubscribed, isLoading } = useQuery({
    queryKey: ["notification-subscribers", "unsubscribe", token],
    queryFn: () => unsubscribeNotification(token!),
    enabled: !!token,
    retry: false,
  });

  if (isLoading) return <PageLoader />;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 py-24 text-center">
      <Seo title="Cancelar inscrição" description="Cancele o recebimento de avisos de novos obituários." />
      <Reveal className="space-y-4">
        {unsubscribed ? (
          <>
            <CheckCircle2 className="mx-auto size-10 text-accent" />
            <h1 className="font-heading text-2xl text-primary">Inscrição cancelada</h1>
            <p className="text-secondary">Você não vai mais receber avisos de novos obituários por e-mail.</p>
          </>
        ) : (
          <>
            <XCircle className="mx-auto size-10 text-secondary" />
            <h1 className="font-heading text-2xl text-primary">Link inválido</h1>
            <p className="text-secondary">
              Não encontramos essa inscrição — ela já pode ter sido cancelada antes.
            </p>
          </>
        )}
        <Button asChild variant="outline">
          <Link to="/">Voltar ao site</Link>
        </Button>
      </Reveal>
    </main>
  );
}
