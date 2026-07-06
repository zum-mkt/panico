import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { Seo } from "@/components/seo/Seo";
import { QRCodeSVG } from "qrcode.react";
import { Share2, MapPin } from "lucide-react";
import {
  getObituaryById,
  listApprovedMessages,
  submitHomageMessage,
} from "@/services/obituariesService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/ui/reveal";
import { toast } from "sonner";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" });
const dateOnlyFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });

const messageSchema = z.object({
  author_name: z.string().min(2, "Informe seu nome"),
  message: z.string().min(3, "Escreva uma mensagem"),
});

export function ObituarioDetalhe() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [shareCopied, setShareCopied] = useState(false);

  const { data: obituary } = useQuery({
    queryKey: ["obituaries", id],
    queryFn: () => getObituaryById(id!),
    enabled: !!id,
  });

  const { data: messages } = useQuery({
    queryKey: ["obituaries", id, "messages"],
    queryFn: () => listApprovedMessages(id!),
    enabled: !!id,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { author_name: "", message: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof messageSchema>) =>
      submitHomageMessage(id!, values.author_name, values.message),
    onSuccess: () => {
      toast.success("Mensagem enviada! Ela aparecerá após aprovação.");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["obituaries", id, "messages"] });
    },
    onError: () => toast.error("Não foi possível enviar sua mensagem."),
  });

  if (!obituary) return null;

  const pageUrl = window.location.href;
  const location = obituary.wake_location || obituary.burial_location;

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title: obituary!.name, url: pageUrl });
      return;
    }
    await navigator.clipboard.writeText(pageUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }

  return (
    <main className="mx-auto max-w-3xl space-y-12 px-6 py-24">
      <Seo
        title={obituary.seo_title || obituary.name}
        description={obituary.seo_description ?? undefined}
        image={obituary.photo_url ?? undefined}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: obituary.name,
              image: obituary.photo_url ?? undefined,
            },
          })}
        </script>
      </Helmet>

      <Reveal className="space-y-6 text-center">
        {obituary.photo_url && (
          <img
            src={obituary.photo_url}
            alt={obituary.name}
            className="mx-auto aspect-square w-48 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="font-heading text-3xl text-primary">{obituary.name}</h1>
          <p className="text-secondary">{dateOnlyFormatter.format(new Date(obituary.deceased_at))}</p>
        </div>
        {obituary.message && <p className="text-secondary">{obituary.message}</p>}

        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="size-4" />
            {shareCopied ? "Link copiado!" : "Compartilhar"}
          </Button>
        </div>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2">
        {obituary.wake_location && (
          <div className="space-y-1 rounded-card border border-border bg-card p-6">
            <p className="text-sm font-medium text-accent">Velório</p>
            <p>{obituary.wake_location}</p>
            {obituary.wake_at && <p className="text-sm text-secondary">{dateFormatter.format(new Date(obituary.wake_at))}</p>}
          </div>
        )}
        {obituary.burial_location && (
          <div className="space-y-1 rounded-card border border-border bg-card p-6">
            <p className="text-sm font-medium text-accent">Sepultamento</p>
            <p>{obituary.burial_location}</p>
            {obituary.burial_at && <p className="text-sm text-secondary">{dateFormatter.format(new Date(obituary.burial_at))}</p>}
          </div>
        )}
      </div>

      {location && (
        <div className="space-y-3">
          <p className="flex items-center gap-2 font-heading text-lg text-primary">
            <MapPin className="size-5" /> Localização
          </p>
          <iframe
            title="Mapa"
            className="h-72 w-full rounded-card border border-border"
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
          />
        </div>
      )}

      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-card p-8">
        <p className="text-sm text-secondary">Escaneie para acessar esta página</p>
        <QRCodeSVG value={pageUrl} size={128} fgColor="#294B3D" />
      </div>

      <section className="space-y-6">
        <h2 className="font-heading text-xl text-primary">Mensagens de homenagem</h2>

        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="space-y-4 rounded-card border border-border bg-card p-6"
        >
          <div className="space-y-2">
            <Label htmlFor="author_name">Seu nome</Label>
            <Input id="author_name" {...form.register("author_name")} />
            {form.formState.errors.author_name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.author_name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea id="message" {...form.register("message")} />
            {form.formState.errors.message && (
              <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
            )}
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Enviando…" : "Enviar homenagem"}
          </Button>
        </form>

        {messages?.length ? (
          <ul className="space-y-4">
            {messages.map((m) => (
              <li key={m.id} className="rounded-card border border-border bg-card p-4">
                <p className="text-sm">{m.message}</p>
                <p className="mt-1 text-xs text-secondary">{m.author_name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-secondary">Seja o primeiro a deixar uma homenagem.</p>
        )}
      </section>
    </main>
  );
}
