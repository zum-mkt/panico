import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { uploadTestimonialPhoto } from "@/services/testimonialsService";
import type { Testimonial } from "@/types/testimonial";

export type TestimonialFormValues = {
  author_name: string;
  author_photo_url: string | null;
  content: string;
  rating: number | null;
  is_active: boolean;
};

export function DepoimentoForm({
  open,
  onOpenChange,
  testimonial,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial?: Testimonial | null;
  onSubmit: (values: TestimonialFormValues) => void;
  submitting?: boolean;
}) {
  const [authorName, setAuthorName] = useState(testimonial?.author_name ?? "");
  const [photoUrl, setPhotoUrl] = useState<string | null>(testimonial?.author_photo_url ?? null);
  const [content, setContent] = useState(testimonial?.content ?? "");
  const [rating, setRating] = useState(testimonial?.rating ?? 5);
  const [isActive, setIsActive] = useState(testimonial?.is_active ?? true);
  const [uploading, setUploading] = useState(false);

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setPhotoUrl(await uploadTestimonialPhoto(file));
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{testimonial ? "Editar depoimento" : "Novo depoimento"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Foto</Label>
            <Input type="file" accept="image/*" onChange={handlePhoto} />
            {uploading && <p className="text-sm text-secondary">Enviando…</p>}
            {photoUrl && <img src={photoUrl} alt="" className="size-12 rounded-full object-cover" />}
          </div>
          <div className="space-y-2">
            <Label>Depoimento</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Nota (1 a 5)</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={rating ?? 5}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Ativo</Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={submitting || !authorName || !content}
            onClick={() =>
              onSubmit({
                author_name: authorName,
                author_photo_url: photoUrl,
                content,
                rating,
                is_active: isActive,
              })
            }
          >
            {submitting ? "Salvando…" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
