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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { slugify, uploadBlogCover } from "@/services/blogService";
import type { BlogPost } from "@/types/blogPost";

const schema = z.object({
  title: z.string().min(2, "Informe o título"),
  slug: z.string().min(2, "Informe o slug"),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(["draft", "published"]),
  published_at: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export type PostFormValues = z.infer<typeof schema>;

function toFormValues(p?: BlogPost | null): PostFormValues {
  return {
    title: p?.title ?? "",
    slug: p?.slug ?? "",
    excerpt: p?.excerpt ?? "",
    category: p?.category ?? "",
    tags: p?.tags?.join(", ") ?? "",
    status: p?.status ?? "draft",
    published_at: p?.published_at?.slice(0, 16) ?? "",
    seo_title: p?.seo_title ?? "",
    seo_description: p?.seo_description ?? "",
  };
}

export function PostForm({
  open,
  onOpenChange,
  post,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: BlogPost | null;
  onSubmit: (values: PostFormValues & { content: string; cover_image_url: string | null }) => void;
  submitting?: boolean;
}) {
  const [content, setContent] = useState(post?.content ?? "");
  const [coverUrl, setCoverUrl] = useState<string | null>(post?.cover_image_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(!!post);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(schema),
    values: toFormValues(post),
  });

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setCoverUrl(await uploadBlogCover(file));
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? "Editar artigo" : "Novo artigo"}</DialogTitle>
        </DialogHeader>

        <form
          id="post-form"
          className="space-y-4"
          onSubmit={form.handleSubmit((values) =>
            onSubmit({ ...values, content, cover_image_url: coverUrl }),
          )}
        >
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              {...form.register("title", {
                onChange: (e) => {
                  if (!slugEdited) form.setValue("slug", slugify(e.target.value));
                },
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              {...form.register("slug", { onChange: () => setSlugEdited(true) })}
            />
          </div>

          <div className="space-y-2">
            <Label>Imagem de capa</Label>
            <Input type="file" accept="image/*" onChange={handleCover} />
            {uploading && <p className="text-sm text-secondary">Enviando…</p>}
            {coverUrl && <img src={coverUrl} alt="" className="h-32 rounded-md object-cover" />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Resumo</Label>
            <Textarea id="excerpt" {...form.register("excerpt")} />
          </div>

          <div className="space-y-2">
            <Label>Conteúdo</Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input id="category" {...form.register("category")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input id="tags" {...form.register("tags")} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
            <div className="space-y-2">
              <Label htmlFor="published_at">Agendar publicação</Label>
              <Input id="published_at" type="datetime-local" {...form.register("published_at")} />
            </div>
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
          <Button type="submit" form="post-form" disabled={submitting || uploading}>
            {submitting ? "Salvando…" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
