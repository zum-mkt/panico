import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSetting } from "@/services/homeService";
import { upsertSetting, uploadHeroImage } from "@/services/settingsService";
import type { PageHeroContent } from "@/hooks/usePageHero";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

/** Editor genérico do Hero de uma página interna — ver src/hooks/usePageHero.ts. */
export function PageHeroTab({
  settingsKey,
  defaults,
}: {
  settingsKey: string;
  defaults: Required<PageHeroContent>;
}) {
  const { data } = useQuery({
    queryKey: ["settings", settingsKey],
    queryFn: () => getSetting<PageHeroContent>(settingsKey),
  });
  const [values, setValues] = useState<PageHeroContent>(defaults);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => upsertSetting(settingsKey, values),
    onSuccess: () => toast.success("Hero da página salvo."),
  });

  async function handleImage(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadHeroImage(file);
      setValues((p) => ({ ...p, image_url: url }));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <div className="space-y-2">
        <Label>Texto de destaque (eyebrow)</Label>
        <Input
          value={values.eyebrow ?? ""}
          onChange={(e) => setValues((p) => ({ ...p, eyebrow: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Título</Label>
        <Textarea
          value={values.title ?? ""}
          onChange={(e) => setValues((p) => ({ ...p, title: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Descrição</Label>
        <Textarea
          value={values.description ?? ""}
          onChange={(e) => setValues((p) => ({ ...p, description: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Imagem</Label>
        <Input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} />
        {uploading && <p className="text-sm text-secondary">Enviando…</p>}
        {values.image_url && (
          <img src={values.image_url} alt="" className="h-40 w-full rounded-card object-cover" />
        )}
      </div>
      <div className="space-y-2">
        <Label>Texto do botão</Label>
        <Input
          value={values.primary_label ?? ""}
          onChange={(e) => setValues((p) => ({ ...p, primary_label: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Link do botão</Label>
        <Input
          type="url"
          placeholder="https://instagram.com/..."
          value={values.primary_href ?? ""}
          onChange={(e) => setValues((p) => ({ ...p, primary_href: e.target.value }))}
        />
      </div>
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? "Salvando…" : "Salvar"}
      </Button>
    </div>
  );
}
