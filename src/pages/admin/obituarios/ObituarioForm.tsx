import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { uploadObituaryPhoto } from "@/services/obituariesService";
import type { Obituary } from "@/types/obituary";

const schema = z.object({
  name: z.string().min(2, "Informe o nome"),
  deceased_at: z.string().min(1, "Informe a data de falecimento"),
  spouse_name: z.string().optional(),
  children_names: z.string().optional(),
  wake_location: z.string().optional(),
  wake_at: z.string().optional(),
  wake_map_url: z.string().optional(),
  burial_location: z.string().optional(),
  burial_at: z.string().optional(),
  burial_map_url: z.string().optional(),
  message: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  status: z.enum(["draft", "published"]),
  published_at: z.string().optional(),
});

export type ObituaryFormValues = z.infer<typeof schema>;

function toFormValues(o?: Obituary | null): ObituaryFormValues {
  return {
    name: o?.name ?? "",
    deceased_at: o?.deceased_at ?? "",
    spouse_name: o?.spouse_name ?? "",
    children_names: o?.children_names ?? "",
    wake_location: o?.wake_location ?? "",
    wake_at: o?.wake_at?.slice(0, 16) ?? "",
    wake_map_url: o?.wake_map_url ?? "",
    burial_location: o?.burial_location ?? "",
    burial_at: o?.burial_at?.slice(0, 16) ?? "",
    burial_map_url: o?.burial_map_url ?? "",
    message: o?.message ?? "",
    seo_title: o?.seo_title ?? "",
    seo_description: o?.seo_description ?? "",
    status: o?.status ?? "draft",
    published_at: o?.published_at?.slice(0, 16) ?? "",
  };
}

export function ObituarioForm({
  open,
  onOpenChange,
  obituary,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obituary?: Obituary | null;
  onSubmit: (values: ObituaryFormValues & { photo_url?: string | null }) => void;
  submitting?: boolean;
}) {
  const [photoUrl, setPhotoUrl] = useState<string | null | undefined>(obituary?.photo_url);
  const [uploading, setUploading] = useState(false);

  const form = useForm<ObituaryFormValues>({
    resolver: zodResolver(schema),
    values: toFormValues(obituary),
  });

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadObituaryPhoto(file);
      setPhotoUrl(url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{obituary ? "Editar obituário" : "Novo obituário"}</DialogTitle>
        </DialogHeader>

        <form
          id="obituary-form"
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => onSubmit({ ...values, photo_url: photoUrl }))}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...form.register("name")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Foto</Label>
            <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} />
            {uploading && <p className="text-sm text-secondary">Enviando…</p>}
            {photoUrl && <img src={photoUrl} alt="" className="size-20 rounded-full object-cover" />}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deceased_at">Data de falecimento</Label>
              <Input id="deceased_at" type="date" {...form.register("deceased_at")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                {...form.register("status")}
                className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="spouse_name">Nome do(a) cônjuge</Label>
              <Input id="spouse_name" {...form.register("spouse_name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="children_names">Nome dos filhos</Label>
              <Textarea
                id="children_names"
                placeholder={"Um nome por linha"}
                {...form.register("children_names")}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="wake_location">Local do velório</Label>
              <Input id="wake_location" {...form.register("wake_location")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wake_at">Data/hora do velório</Label>
              <Input id="wake_at" type="datetime-local" {...form.register("wake_at")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="wake_map_url">Link do mapa do velório (Google Maps)</Label>
            <Input
              id="wake_map_url"
              placeholder="https://www.google.com/maps/embed?pb=..."
              {...form.register("wake_map_url")}
            />
            <p className="text-xs text-secondary">
              No Google Maps: Compartilhar → Incorporar um mapa → copie o link (src) do iframe
              para exibir a localização exata.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="burial_location">Local do sepultamento</Label>
              <Input id="burial_location" {...form.register("burial_location")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="burial_at">Data/hora do sepultamento</Label>
              <Input id="burial_at" type="datetime-local" {...form.register("burial_at")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="burial_map_url">Link do mapa do sepultamento (Google Maps)</Label>
            <Input
              id="burial_map_url"
              placeholder="https://www.google.com/maps/embed?pb=..."
              {...form.register("burial_map_url")}
            />
            <p className="text-xs text-secondary">
              No Google Maps: Compartilhar → Incorporar um mapa → copie o link (src) do iframe
              para exibir a localização exata.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea id="message" {...form.register("message")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="published_at">Agendar publicação (opcional)</Label>
            <Input id="published_at" type="datetime-local" {...form.register("published_at")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_title">SEO — Título</Label>
            <Input id="seo_title" {...form.register("seo_title")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo_description">SEO — Descrição</Label>
            <Textarea id="seo_description" {...form.register("seo_description")} />
          </div>
        </form>

        <DialogFooter>
          <Button type="submit" form="obituary-form" disabled={submitting || uploading}>
            {submitting ? "Salvando…" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
