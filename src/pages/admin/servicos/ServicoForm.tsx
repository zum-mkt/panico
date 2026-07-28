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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { iconNames } from "@/lib/iconMap";
import { uploadServiceImage } from "@/services/servicesService";
import type { Service } from "@/types/service";

export type ServiceFormValues = {
  title: string;
  description: string;
  icon: string;
  image_url: string | null;
  content_html: string;
  is_active: boolean;
};

export function ServicoForm({
  open,
  onOpenChange,
  service,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  onSubmit: (values: ServiceFormValues) => void;
  submitting?: boolean;
}) {
  const [title, setTitle] = useState(service?.title ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [icon, setIcon] = useState(service?.icon ?? iconNames[0]);
  const [imageUrl, setImageUrl] = useState<string | null>(service?.image_url ?? null);
  const [contentHtml, setContentHtml] = useState(service?.content_html ?? "");
  const [isActive, setIsActive] = useState(service?.is_active ?? true);
  const [uploading, setUploading] = useState(false);

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setImageUrl(await uploadServiceImage(file));
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? "Editar serviço" : "Novo serviço"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Descrição curta (aparece no card)</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Imagem (opcional, aparece na janela de detalhes)</Label>
            <Input type="file" accept="image/*" onChange={handleImage} />
            {uploading && <p className="text-sm text-secondary">Enviando…</p>}
            {imageUrl && (
              <img src={imageUrl} alt="" className="h-32 w-full rounded-card object-cover" />
            )}
          </div>
          <div className="space-y-2">
            <Label>Conteúdo detalhado (aparece na janela ao clicar no card)</Label>
            <RichTextEditor value={contentHtml} onChange={setContentHtml} />
          </div>
          <div className="space-y-2">
            <Label>Ícone</Label>
            <select
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            >
              {iconNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Ativo</Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={submitting || !title}
            onClick={() =>
              onSubmit({
                title,
                description,
                icon,
                image_url: imageUrl,
                content_html: contentHtml,
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
