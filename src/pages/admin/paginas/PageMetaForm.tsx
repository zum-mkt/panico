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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { slugify } from "@/services/blogService";
import type { Page } from "@/types/page";

export type PageMetaValues = {
  title: string;
  slug: string;
  status: "draft" | "published";
  seo_title: string;
  seo_description: string;
};

export function PageMetaForm({
  open,
  onOpenChange,
  page,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page?: Page | null;
  onSubmit: (values: PageMetaValues) => void;
  submitting?: boolean;
}) {
  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!page);
  const [status, setStatus] = useState<"draft" | "published">(page?.status ?? "draft");
  const [seoTitle, setSeoTitle] = useState(page?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(page?.seo_description ?? "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{page ? "Editar página" : "Nova página"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugEdited) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Slug (URL)</Label>
            <Input value={slug} onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm"
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>SEO — Título</Label>
            <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>SEO — Descrição</Label>
            <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={submitting}
            onClick={() =>
              onSubmit({ title, slug, status, seo_title: seoTitle, seo_description: seoDescription })
            }
          >
            {submitting ? "Salvando…" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
