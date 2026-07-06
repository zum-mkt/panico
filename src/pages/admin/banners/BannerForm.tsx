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
import { Switch } from "@/components/ui/switch";
import { uploadBannerImage } from "@/services/bannersService";
import type { Banner } from "@/types/banner";

export type BannerFormValues = {
  title: string;
  image_desktop_url: string | null;
  image_tablet_url: string | null;
  image_mobile_url: string | null;
  link_url: string;
  cta_label: string;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
};

function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      onChange(await uploadBannerImage(file));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type="file" accept="image/*" onChange={handleChange} />
      {uploading && <p className="text-sm text-secondary">Enviando…</p>}
      {value && <img src={value} alt="" className="h-20 rounded-md object-cover" />}
    </div>
  );
}

export function BannerForm({
  open,
  onOpenChange,
  banner,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: Banner | null;
  onSubmit: (values: BannerFormValues) => void;
  submitting?: boolean;
}) {
  const [title, setTitle] = useState(banner?.title ?? "");
  const [desktop, setDesktop] = useState<string | null>(banner?.image_desktop_url ?? null);
  const [tablet, setTablet] = useState<string | null>(banner?.image_tablet_url ?? null);
  const [mobile, setMobile] = useState<string | null>(banner?.image_mobile_url ?? null);
  const [linkUrl, setLinkUrl] = useState(banner?.link_url ?? "");
  const [ctaLabel, setCtaLabel] = useState(banner?.cta_label ?? "");
  const [startsAt, setStartsAt] = useState(banner?.starts_at?.slice(0, 16) ?? "");
  const [endsAt, setEndsAt] = useState(banner?.ends_at?.slice(0, 16) ?? "");
  const [isActive, setIsActive] = useState(banner?.is_active ?? true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{banner ? "Editar banner" : "Novo banner"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <ImageUploadField label="Imagem — Desktop" value={desktop} onChange={setDesktop} />
          <ImageUploadField label="Imagem — Tablet" value={tablet} onChange={setTablet} />
          <ImageUploadField label="Imagem — Mobile" value={mobile} onChange={setMobile} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Texto do botão (CTA)</Label>
              <Input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Link</Label>
              <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Início do agendamento</Label>
              <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Fim do agendamento</Label>
              <Input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Ativo</Label>
          </div>

          {(desktop || tablet || mobile) && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="relative overflow-hidden rounded-card border border-border">
                <img
                  src={desktop ?? tablet ?? mobile ?? ""}
                  alt=""
                  className="aspect-[21/9] w-full object-cover"
                />
                {(title || ctaLabel) && (
                  <div className="absolute inset-0 flex flex-col items-start justify-end gap-2 bg-gradient-to-t from-black/50 to-transparent p-4">
                    {title && <p className="font-heading text-white">{title}</p>}
                    {ctaLabel && <Button size="sm">{ctaLabel}</Button>}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            disabled={submitting}
            onClick={() =>
              onSubmit({
                title,
                image_desktop_url: desktop,
                image_tablet_url: tablet,
                image_mobile_url: mobile,
                link_url: linkUrl,
                cta_label: ctaLabel,
                starts_at: startsAt,
                ends_at: endsAt,
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
