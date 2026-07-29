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
import { uploadPartnerLogo } from "@/services/partnersService";
import type { Partner } from "@/types/partner";

export type PartnerFormValues = {
  name: string;
  logo_url: string | null;
  photo_url: string | null;
  description: string;
  link_url: string;
  is_active: boolean;
};

export function ParceiroForm({
  open,
  onOpenChange,
  partner,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner?: Partner | null;
  onSubmit: (values: PartnerFormValues) => void;
  submitting?: boolean;
}) {
  const [name, setName] = useState(partner?.name ?? "");
  const [logoUrl, setLogoUrl] = useState<string | null>(partner?.logo_url ?? null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(partner?.photo_url ?? null);
  const [description, setDescription] = useState(partner?.description ?? "");
  const [linkUrl, setLinkUrl] = useState(partner?.link_url ?? "");
  const [isActive, setIsActive] = useState(partner?.is_active ?? true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  async function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      setLogoUrl(await uploadPartnerLogo(file));
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      setPhotoUrl(await uploadPartnerLogo(file));
    } finally {
      setUploadingPhoto(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{partner ? "Editar parceiro" : "Novo parceiro"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Logo</Label>
            <Input type="file" accept="image/*" onChange={handleLogo} />
            {uploadingLogo && <p className="text-sm text-secondary">Enviando…</p>}
            {logoUrl && <img src={logoUrl} alt="" className="h-10" />}
          </div>
          <div className="space-y-2">
            <Label>Foto (exibida no card, na Home)</Label>
            <Input type="file" accept="image/*" onChange={handlePhoto} />
            {uploadingPhoto && <p className="text-sm text-secondary">Enviando…</p>}
            {photoUrl && (
              <img src={photoUrl} alt="" className="h-32 w-full rounded-card object-cover" />
            )}
          </div>
          <div className="space-y-2">
            <Label>Descrição (a vantagem oferecida aos associados)</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Link (site do parceiro)</Label>
            <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Ativo</Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={submitting || !name}
            onClick={() =>
              onSubmit({
                name,
                logo_url: logoUrl,
                photo_url: photoUrl,
                description,
                link_url: linkUrl,
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
