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
import { uploadPartnerLogo } from "@/services/partnersService";
import type { Partner } from "@/types/partner";

export type PartnerFormValues = {
  name: string;
  logo_url: string | null;
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
  const [linkUrl, setLinkUrl] = useState(partner?.link_url ?? "");
  const [isActive, setIsActive] = useState(partner?.is_active ?? true);
  const [uploading, setUploading] = useState(false);

  async function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setLogoUrl(await uploadPartnerLogo(file));
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
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
            {uploading && <p className="text-sm text-secondary">Enviando…</p>}
            {logoUrl && <img src={logoUrl} alt="" className="h-10" />}
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
            onClick={() => onSubmit({ name, logo_url: logoUrl, link_url: linkUrl, is_active: isActive })}
          >
            {submitting ? "Salvando…" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
