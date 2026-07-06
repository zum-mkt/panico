import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { getSetting } from "@/services/homeService";
import { upsertSetting, uploadSiteAsset } from "@/services/settingsService";
import { defaultTheme, type ThemeTokens } from "@/contexts/ThemeContext";
import type { MarketingSettings } from "@/components/seo/MarketingScripts";
import type { Location } from "@/types/location";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type SiteSettings = {
  logo_url?: string;
  favicon_url?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  instagram?: string;
  facebook?: string;
};

function GeralTab() {
  const { data } = useQuery({ queryKey: ["settings", "site"], queryFn: () => getSetting<SiteSettings>("site") });
  const [values, setValues] = useState<SiteSettings>({});
  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => upsertSetting("site", values),
    onSuccess: () => toast.success("Configurações salvas."),
  });

  async function handleAsset(key: "logo_url" | "favicon_url", file?: File) {
    if (!file) return;
    const url = await uploadSiteAsset(file);
    setValues((prev) => ({ ...prev, [key]: url }));
  }

  return (
    <div className="max-w-xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Logo</Label>
          <Input type="file" accept="image/*" onChange={(e) => handleAsset("logo_url", e.target.files?.[0])} />
          {values.logo_url && <img src={values.logo_url} alt="" className="h-10" />}
        </div>
        <div className="space-y-2">
          <Label>Favicon</Label>
          <Input type="file" accept="image/*" onChange={(e) => handleAsset("favicon_url", e.target.files?.[0])} />
          {values.favicon_url && <img src={values.favicon_url} alt="" className="size-8" />}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Telefone</Label>
          <Input value={values.phone ?? ""} onChange={(e) => setValues((p) => ({ ...p, phone: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>WhatsApp (só números, com DDI)</Label>
          <Input value={values.whatsapp ?? ""} onChange={(e) => setValues((p) => ({ ...p, whatsapp: e.target.value }))} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Endereço</Label>
        <Input value={values.address ?? ""} onChange={(e) => setValues((p) => ({ ...p, address: e.target.value }))} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Instagram (URL)</Label>
          <Input value={values.instagram ?? ""} onChange={(e) => setValues((p) => ({ ...p, instagram: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Facebook (URL)</Label>
          <Input value={values.facebook ?? ""} onChange={(e) => setValues((p) => ({ ...p, facebook: e.target.value }))} />
        </div>
      </div>

      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        Salvar
      </Button>
    </div>
  );
}

function TemaTab() {
  const { data } = useQuery({ queryKey: ["settings", "theme"], queryFn: () => getSetting<ThemeTokens>("theme") });
  const [values, setValues] = useState<ThemeTokens>(defaultTheme);
  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => upsertSetting("theme", values),
    onSuccess: () => toast.success("Tema salvo — recarregue a página para ver o efeito em todo o site."),
  });

  const colorFields: { key: keyof ThemeTokens["colors"]; label: string }[] = [
    { key: "background", label: "Fundo" },
    { key: "surface", label: "Superfície (cards)" },
    { key: "primary", label: "Primária" },
    { key: "secondary", label: "Secundária" },
    { key: "accent", label: "Destaque" },
    { key: "text", label: "Texto" },
  ];

  return (
    <div className="max-w-xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {colorFields.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <Label>{label}</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                className="h-8 w-14 p-1"
                value={values.colors[key]}
                onChange={(e) =>
                  setValues((p) => ({ ...p, colors: { ...p.colors, [key]: e.target.value } }))
                }
              />
              <Input
                value={values.colors[key]}
                onChange={(e) =>
                  setValues((p) => ({ ...p, colors: { ...p.colors, [key]: e.target.value } }))
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Fonte dos títulos</Label>
          <Input
            value={values.fonts.heading}
            onChange={(e) => setValues((p) => ({ ...p, fonts: { ...p.fonts, heading: e.target.value } }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Fonte do texto</Label>
          <Input
            value={values.fonts.body}
            onChange={(e) => setValues((p) => ({ ...p, fonts: { ...p.fonts, body: e.target.value } }))}
          />
        </div>
      </div>

      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        Salvar tema
      </Button>
    </div>
  );
}

function UnidadesTab() {
  const { data } = useQuery({
    queryKey: ["settings", "locations"],
    queryFn: () => getSetting<Location[]>("locations"),
  });
  const [items, setItems] = useState<Location[]>([]);
  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => upsertSetting("locations", items),
    onSuccess: () => toast.success("Unidades salvas."),
  });

  function update(i: number, patch: Partial<Location>) {
    setItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }
  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }
  function add() {
    setItems((prev) => [...prev, { name: "", address: "", phone: "", email: "" }]);
  }

  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-sm text-secondary">
        Unidades exibidas na página de Contato, cada uma com endereço, telefone, e-mail e mapa.
      </p>
      {items.map((item, i) => (
        <Card key={i} className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <Label>Nome da unidade</Label>
              <Input value={item.name} onChange={(e) => update(i, { name: e.target.value })} />
            </div>
            <Button size="icon-sm" variant="ghost" onClick={() => remove(i)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Endereço</Label>
            <Input value={item.address} onChange={(e) => update(i, { address: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={item.phone} onChange={(e) => update(i, { phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input value={item.email} onChange={(e) => update(i, { email: e.target.value })} />
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" onClick={add}>
        <Plus className="size-4" /> Adicionar unidade
      </Button>
      <div>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando…" : "Salvar"}
        </Button>
      </div>
    </div>
  );
}

function ScriptsTab() {
  const { data } = useQuery({
    queryKey: ["settings", "marketing"],
    queryFn: () => getSetting<MarketingSettings>("marketing"),
  });
  const [values, setValues] = useState<MarketingSettings>({});
  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => upsertSetting("marketing", values),
    onSuccess: () => toast.success("Scripts salvos."),
  });

  return (
    <div className="max-w-xl space-y-4">
      <div className="space-y-2">
        <Label>Google Analytics (Measurement ID)</Label>
        <Input
          placeholder="G-XXXXXXXXXX"
          value={values.ga_id ?? ""}
          onChange={(e) => setValues((p) => ({ ...p, ga_id: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Google Tag Manager (Container ID)</Label>
        <Input
          placeholder="GTM-XXXXXXX"
          value={values.gtm_id ?? ""}
          onChange={(e) => setValues((p) => ({ ...p, gtm_id: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Meta Pixel (ID)</Label>
        <Input
          value={values.meta_pixel_id ?? ""}
          onChange={(e) => setValues((p) => ({ ...p, meta_pixel_id: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Microsoft Clarity (ID)</Label>
        <Input
          value={values.clarity_id ?? ""}
          onChange={(e) => setValues((p) => ({ ...p, clarity_id: e.target.value }))}
        />
      </div>
      <p className="text-xs text-secondary">
        Os scripts só são carregados no site quando o respectivo ID estiver preenchido.
      </p>
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        Salvar scripts
      </Button>
    </div>
  );
}

export function ConfiguracoesAdmin() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-heading text-2xl text-primary">Configurações Gerais</h1>
        <p className="text-secondary">Logo, contato, redes sociais, tema e scripts globais.</p>
      </div>

      <Tabs defaultValue="geral">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="unidades">Unidades</TabsTrigger>
          <TabsTrigger value="tema">Cores e Fontes</TabsTrigger>
          <TabsTrigger value="scripts">Scripts globais</TabsTrigger>
        </TabsList>
        <TabsContent value="geral">
          <GeralTab />
        </TabsContent>
        <TabsContent value="unidades">
          <UnidadesTab />
        </TabsContent>
        <TabsContent value="tema">
          <TemaTab />
        </TabsContent>
        <TabsContent value="scripts">
          <ScriptsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
