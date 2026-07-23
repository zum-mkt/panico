import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { Seo } from "@/components/seo/Seo";
import { Share2, MapPin, Clock, Heart, Users, MessageCircle, ExternalLink } from "lucide-react";
import {
  getObituaryById,
  listApprovedMessages,
  submitHomageMessage,
} from "@/services/obituariesService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Reveal } from "@/components/ui/reveal";
import { toast } from "sonner";

const dateOnlyFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });
const timeFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });
const messageDateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });

const messageSchema = z.object({
  author_name: z.string().min(2, "Informe seu nome"),
  message: z.string().min(3, "Escreva uma mensagem"),
});

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function splitNames(value?: string | null): string[] {
  return (value ?? "")
    .split(/\n|,/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function LocationCard({
  title,
  location,
  at,
  mapUrl,
}: {
  title: string;
  location: string;
  at?: string | null;
  mapUrl?: string | null;
}) {
  const embedSrc = mapUrl || `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
  const openUrl = mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  return (
    <div className="overflow-hidden rounded-card border border-border bg-card">
      <div className="space-y-2 p-6">
        <p className="text-sm font-medium tracking-wide text-accent">{title}</p>
        <p className="flex items-start gap-2 font-heading text-lg text-primary">
          <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
          {location}
        </p>
        {at && (
          <p className="flex items-center gap-2 text-sm text-secondary">
            <Clock className="size-3.5 shrink-0" />
            {timeFormatter.format(new Date(at))}
          </p>
        )}
      </div>
      <iframe
        title={`Mapa — ${title}`}
        className="h-56 w-full border-t border-border"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={embedSrc}
      />
      <a
        href={openUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-1.5 border-t border-border py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
      >
        Abrir no Google Maps
        <ExternalLink className="size-3.5" />
      </a>
    </div>
  );
}

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
  const children = splitNames(obituary.children_names);

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
    <main className="mx-auto max-w-3xl space-y-14 px-6 py-24">
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

      {/* Cabeçalho */}
      <Reveal className="space-y-5 text-center">
        {obituary.photo_url ? (
          <img
            src={obituary.photo_url}
            alt={obituary.name}
            className="mx-auto aspect-square w-40 rounded-full object-cover shadow-sm sm:w-48"
          />
        ) : (
          <div className="mx-auto flex aspect-square w-40 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 sm:w-48">
            <span className="font-heading text-4xl text-primary/50">{initials(obituary.name)}</span>
          </div>
        )}
        <div className="space-y-1.5">
          <h1 className="font-heading text-3xl text-primary sm:text-4xl">{obituary.name}</h1>
          <p className="text-secondary">{dateOnlyFormatter.format(new Date(obituary.deceased_at))}</p>
        </div>
        {obituary.message && (
          <p className="mx-auto max-w-xl text-secondary italic">"{obituary.message}"</p>
        )}
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="size-4" />
          {shareCopied ? "Link copiado!" : "Compartilhar"}
        </Button>
      </Reveal>

      {/* Família */}
      {(obituary.spouse_name || children.length > 0) && (
        <Reveal className="rounded-card border border-border bg-card p-6">
          <div className="flex items-center gap-2 pb-4 text-primary">
            <Heart className="size-4 text-accent" />
            <p className="font-heading text-lg">Deixa</p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {obituary.spouse_name && (
              <div className="space-y-1">
                <dt className="text-xs font-medium tracking-wide text-accent">Cônjuge</dt>
                <dd className="text-secondary">{obituary.spouse_name}</dd>
              </div>
            )}
            {children.length > 0 && (
              <div className="space-y-1">
                <dt className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-accent">
                  <Users className="size-3" />
                  {children.length > 1 ? "Filhos" : "Filho(a)"}
                </dt>
                <dd className="text-secondary">{children.join(", ")}</dd>
              </div>
            )}
          </dl>
        </Reveal>
      )}

      {/* Locais e mapas */}
      {(obituary.wake_location || obituary.burial_location) && (
        <Reveal className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {obituary.wake_location && (
              <LocationCard
                title="Velório"
                location={obituary.wake_location}
                at={obituary.wake_at}
                mapUrl={obituary.wake_map_url}
              />
            )}
            {obituary.burial_location && (
              <LocationCard
                title="Sepultamento"
                location={obituary.burial_location}
                at={obituary.burial_at}
                mapUrl={obituary.burial_map_url}
              />
            )}
          </div>
        </Reveal>
      )}

      {/* Homenagens */}
      <Reveal className="space-y-6">
        <div className="flex items-center gap-2 text-primary">
          <MessageCircle className="size-4 text-accent" />
          <h2 className="font-heading text-xl">Mensagens de homenagem</h2>
        </div>

        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="space-y-4 rounded-card border border-border bg-card p-6"
        >
          <p className="font-heading text-base text-primary">Prestar homenagem</p>
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
              <li key={m.id} className="flex gap-3 rounded-card border border-border bg-card p-4">
                <Avatar size="sm" className="mt-0.5 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {initials(m.author_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm text-secondary">{m.message}</p>
                  <p className="text-xs font-medium text-primary">
                    {m.author_name}
                    <span className="ml-2 font-normal text-secondary/70">
                      {messageDateFormatter.format(new Date(m.created_at))}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-secondary">Seja o primeiro a deixar uma homenagem.</p>
        )}
      </Reveal>
    </main>
  );
}
