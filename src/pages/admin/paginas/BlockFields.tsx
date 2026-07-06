import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { Plus, X } from "lucide-react";
import { uploadPageImage } from "@/services/pagesService";
import { listAllFormsAdmin } from "@/services/formsService";
import type { BlockType } from "@/types/page";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

type Content = Record<string, unknown>;

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      onChange(await uploadPageImage(file));
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type="file" accept="image/*" onChange={handle} />
      {uploading && <p className="text-sm text-secondary">Enviando…</p>}
      {value && <img src={value} alt="" className="h-20 rounded-md object-cover" />}
    </div>
  );
}

function ListItemsField<T extends Record<string, string>>({
  label,
  items,
  fields,
  onChange,
}: {
  label: string;
  items: T[];
  fields: { key: keyof T; placeholder: string }[];
  onChange: (items: T[]) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          {fields.map((f) => (
            <Input
              key={String(f.key)}
              placeholder={f.placeholder}
              value={item[f.key] ?? ""}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...next[i], [f.key]: e.target.value };
                onChange(next);
              }}
            />
          ))}
          <Button variant="ghost" size="icon" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          onChange([...items, Object.fromEntries(fields.map((f) => [f.key, ""])) as T])
        }
      >
        <Plus className="size-4" /> Adicionar
      </Button>
    </div>
  );
}

export function BlockFields({
  type,
  content,
  onChange,
}: {
  type: BlockType;
  content: Content;
  onChange: (content: Content) => void;
}) {
  const set = (patch: Content) => onChange({ ...content, ...patch });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: async (files) => {
      const urls = await Promise.all(files.map(uploadPageImage));
      set({ images: [...((content.images as string[]) ?? []), ...urls] });
    },
  });

  const { data: forms } = useQuery({
    queryKey: ["admin", "forms"],
    queryFn: listAllFormsAdmin,
    enabled: type === "form",
  });

  switch (type) {
    case "hero":
      return (
        <div className="space-y-3">
          <Input placeholder="Eyebrow" value={(content.eyebrow as string) ?? ""} onChange={(e) => set({ eyebrow: e.target.value })} />
          <Input placeholder="Título" value={(content.title as string) ?? ""} onChange={(e) => set({ title: e.target.value })} />
          <Textarea placeholder="Descrição" value={(content.description as string) ?? ""} onChange={(e) => set({ description: e.target.value })} />
          <ImageField label="Imagem" value={content.image_url as string} onChange={(url) => set({ image_url: url })} />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="CTA principal — texto" value={(content.primary_label as string) ?? ""} onChange={(e) => set({ primary_label: e.target.value })} />
            <Input placeholder="CTA principal — link" value={(content.primary_href as string) ?? ""} onChange={(e) => set({ primary_href: e.target.value })} />
            <Input placeholder="CTA secundário — texto" value={(content.secondary_label as string) ?? ""} onChange={(e) => set({ secondary_label: e.target.value })} />
            <Input placeholder="CTA secundário — link" value={(content.secondary_href as string) ?? ""} onChange={(e) => set({ secondary_href: e.target.value })} />
          </div>
        </div>
      );

    case "text":
      return (
        <div className="space-y-3">
          <Input placeholder="Título (opcional)" value={(content.title as string) ?? ""} onChange={(e) => set({ title: e.target.value })} />
          <RichTextEditor value={(content.body as string) ?? ""} onChange={(body) => set({ body })} />
        </div>
      );

    case "image":
      return (
        <div className="space-y-3">
          <ImageField label="Imagem" value={content.url as string} onChange={(url) => set({ url })} />
          <Input placeholder="Alt text" value={(content.alt as string) ?? ""} onChange={(e) => set({ alt: e.target.value })} />
          <Input placeholder="Legenda" value={(content.caption as string) ?? ""} onChange={(e) => set({ caption: e.target.value })} />
        </div>
      );

    case "cta":
      return (
        <div className="space-y-3">
          <Input placeholder="Título" value={(content.title as string) ?? ""} onChange={(e) => set({ title: e.target.value })} />
          <Textarea placeholder="Descrição" value={(content.description as string) ?? ""} onChange={(e) => set({ description: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Texto do botão" value={(content.primary_label as string) ?? ""} onChange={(e) => set({ primary_label: e.target.value })} />
            <Input placeholder="Link" value={(content.primary_href as string) ?? ""} onChange={(e) => set({ primary_href: e.target.value })} />
          </div>
        </div>
      );

    case "cards":
      return (
        <div className="space-y-3">
          <Input placeholder="Título da seção" value={(content.title as string) ?? ""} onChange={(e) => set({ title: e.target.value })} />
          <ListItemsField
            label="Cards"
            items={(content.items as Record<string, string>[]) ?? []}
            fields={[{ key: "title", placeholder: "Título" }, { key: "description", placeholder: "Descrição" }]}
            onChange={(items) => set({ items })}
          />
        </div>
      );

    case "faq":
      return (
        <div className="space-y-3">
          <Input placeholder="Título da seção" value={(content.title as string) ?? ""} onChange={(e) => set({ title: e.target.value })} />
          <ListItemsField
            label="Perguntas"
            items={(content.items as Record<string, string>[]) ?? []}
            fields={[{ key: "question", placeholder: "Pergunta" }, { key: "answer", placeholder: "Resposta" }]}
            onChange={(items) => set({ items })}
          />
        </div>
      );

    case "timeline":
      return (
        <div className="space-y-3">
          <Input placeholder="Título da seção" value={(content.title as string) ?? ""} onChange={(e) => set({ title: e.target.value })} />
          <ListItemsField
            label="Eventos"
            items={(content.items as Record<string, string>[]) ?? []}
            fields={[
              { key: "date", placeholder: "Data" },
              { key: "title", placeholder: "Título" },
              { key: "description", placeholder: "Descrição" },
            ]}
            onChange={(items) => set({ items })}
          />
        </div>
      );

    case "gallery": {
      const images = (content.images as string[]) ?? [];
      return (
        <div className="space-y-3">
          <Input placeholder="Título da seção" value={(content.title as string) ?? ""} onChange={(e) => set({ title: e.target.value })} />
          <div {...getRootProps()} className="cursor-pointer rounded-md border border-dashed border-input p-4 text-center text-sm text-secondary">
            <input {...getInputProps()} />
            {isDragActive ? "Solte as imagens…" : "Clique ou arraste imagens (galeria)"}
          </div>
          <div className="flex flex-wrap gap-2">
            {images.map((url) => (
              <div key={url} className="relative">
                <img src={url} alt="" className="size-16 rounded-md object-cover" />
                <button
                  type="button"
                  onClick={() => set({ images: images.filter((u) => u !== url) })}
                  className="absolute -top-1 -right-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "video":
      return (
        <div className="space-y-3">
          <Input placeholder="Título" value={(content.title as string) ?? ""} onChange={(e) => set({ title: e.target.value })} />
          <Input placeholder="Link do YouTube" value={(content.youtube_url as string) ?? ""} onChange={(e) => set({ youtube_url: e.target.value })} />
        </div>
      );

    case "form":
      return (
        <div className="space-y-3">
          <Input placeholder="Título (opcional)" value={(content.title as string) ?? ""} onChange={(e) => set({ title: e.target.value })} />
          <select
            value={(content.form_slug as string) ?? ""}
            onChange={(e) => set({ form_slug: e.target.value })}
            className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm"
          >
            <option value="">Selecione um formulário…</option>
            {(forms ?? []).map((f) => (
              <option key={f.id} value={f.slug}>
                {f.title}
              </option>
            ))}
          </select>
        </div>
      );

    default:
      return null;
  }
}
