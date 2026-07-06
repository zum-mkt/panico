import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { uploadCrownPhoto } from "@/services/crownsService";
import type { Crown } from "@/types/crown";

const schema = z.object({
  title: z.string().min(2, "Informe o título"),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.string().optional(),
  allow_custom_message: z.boolean(),
  is_available: z.boolean(),
  is_active: z.boolean(),
});

export type CrownFormValues = z.infer<typeof schema>;

function toFormValues(c?: Crown | null): CrownFormValues {
  return {
    title: c?.title ?? "",
    description: c?.description ?? "",
    category: c?.category ?? "",
    price: c?.price != null ? String(c.price) : "",
    allow_custom_message: c?.allow_custom_message ?? true,
    is_available: c?.is_available ?? true,
    is_active: c?.is_active ?? true,
  };
}

export function CoroaForm({
  open,
  onOpenChange,
  crown,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crown?: Crown | null;
  onSubmit: (values: CrownFormValues & { photos: string[] }) => void;
  submitting?: boolean;
}) {
  const [photos, setPhotos] = useState<string[]>(crown?.photos ?? []);
  const [uploading, setUploading] = useState(false);

  const form = useForm<CrownFormValues>({
    resolver: zodResolver(schema),
    values: toFormValues(crown),
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: async (files) => {
      setUploading(true);
      try {
        const urls = await Promise.all(files.map(uploadCrownPhoto));
        setPhotos((prev) => [...prev, ...urls]);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{crown ? "Editar coroa" : "Nova coroa"}</DialogTitle>
        </DialogHeader>

        <form
          id="crown-form"
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => onSubmit({ ...values, photos }))}
        >
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" {...form.register("title")} />
          </div>

          <div className="space-y-2">
            <Label>Galeria de fotos</Label>
            <div
              {...getRootProps()}
              className="cursor-pointer rounded-md border border-dashed border-input p-6 text-center text-sm text-secondary"
            >
              <input {...getInputProps()} />
              {isDragActive ? "Solte as imagens aqui…" : "Clique ou arraste imagens aqui"}
            </div>
            {uploading && <p className="text-sm text-secondary">Enviando…</p>}
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {photos.map((url) => (
                  <div key={url} className="relative">
                    <img src={url} alt="" className="size-20 rounded-md object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotos((prev) => prev.filter((p) => p !== url))}
                      className="absolute -top-1 -right-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input id="category" {...form.register("category")} placeholder="Coroas, Buquês…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input id="price" type="number" step="0.01" {...form.register("price")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" {...form.register("description")} />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="allow_custom_message"
                checked={form.watch("allow_custom_message")}
                onCheckedChange={(v) => form.setValue("allow_custom_message", v)}
              />
              <Label htmlFor="allow_custom_message">Permite mensagem personalizada</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_available"
                checked={form.watch("is_available")}
                onCheckedChange={(v) => form.setValue("is_available", v)}
              />
              <Label htmlFor="is_available">Disponível</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={form.watch("is_active")}
                onCheckedChange={(v) => form.setValue("is_active", v)}
              />
              <Label htmlFor="is_active">Ativo</Label>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button type="submit" form="crown-form" disabled={submitting || uploading}>
            {submitting ? "Salvando…" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
