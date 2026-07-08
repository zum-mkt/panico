import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSetting } from "@/services/homeService";
import { upsertSetting, uploadSiteAsset } from "@/services/settingsService";
import { SEO_PAGE_KEYS, type SeoGlobalSettings, type SeoPagesSettings } from "@/types/seo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PAGE_LABELS: Record<string, string> = {
  home: "Home",
  planos: "Planos",
  coroas: "Coroas",
  cemiterio: "Cemitério Parque",
  obituarios: "Obituários",
  blog: "Blog",
  contato: "Contato",
};

function PaginasTab() {
  const { data } = useQuery({
    queryKey: ["settings", "seo_pages"],
    queryFn: () => getSetting<SeoPagesSettings>("seo_pages"),
  });
  const [values, setValues] = useState<SeoPagesSettings>({});
  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => upsertSetting("seo_pages", values),
    onSuccess: () => toast.success("SEO das páginas salvo."),
  });

  function update(key: string, patch: Partial<{ title: string; description: string }>) {
    setValues((prev) => ({
      ...prev,
      [key]: { title: "", description: "", ...prev[key as keyof SeoPagesSettings], ...patch },
    }));
  }

  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-sm text-secondary">
        Título e descrição exibidos no Google e ao compartilhar cada página. Obituários, Blog,
        Planos e Páginas individuais têm SEO próprio nas suas telas de edição.
      </p>
      {SEO_PAGE_KEYS.map((key) => {
        const entry = values[key];
        return (
          <Card key={key} className="space-y-3 p-4">
            <p className="font-heading text-sm text-primary">{PAGE_LABELS[key]}</p>
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={entry?.title ?? ""} onChange={(e) => update(key, { title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={entry?.description ?? ""}
                onChange={(e) => update(key, { description: e.target.value })}
              />
            </div>
          </Card>
        );
      })}
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? "Salvando…" : "Salvar"}
      </Button>
    </div>
  );
}

function GeralTab() {
  const { data } = useQuery({
    queryKey: ["settings", "seo_global"],
    queryFn: () => getSetting<SeoGlobalSettings>("seo_global"),
  });
  const [values, setValues] = useState<SeoGlobalSettings>({});
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => upsertSetting("seo_global", values),
    onSuccess: () => toast.success("Configurações de SEO salvas."),
  });

  async function handleImage(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadSiteAsset(file);
      setValues((p) => ({ ...p, default_image: url }));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <div className="space-y-2">
        <Label>Imagem padrão ao compartilhar (Open Graph)</Label>
        <p className="text-xs text-secondary">
          Usada quando uma página não tem imagem própria — aparece ao compartilhar o link no
          WhatsApp, Facebook, etc.
        </p>
        <Input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} />
        {uploading && <p className="text-sm text-secondary">Enviando…</p>}
        {values.default_image && (
          <img src={values.default_image} alt="" className="h-32 rounded-card object-cover" />
        )}
      </div>
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? "Salvando…" : "Salvar"}
      </Button>
    </div>
  );
}

const RELATED_LINKS = [
  { label: "Scripts globais (GA, GTM, Pixel, Clarity)", to: "/admin/configuracoes" },
  { label: "SEO de Obituários", to: "/admin/obituarios" },
  { label: "SEO do Blog", to: "/admin/blog" },
  { label: "SEO de Planos", to: "/admin/planos" },
  { label: "SEO de Páginas", to: "/admin/paginas" },
];

export function SeoAdmin() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-heading text-2xl text-primary">SEO</h1>
        <p className="text-secondary">Título, descrição e imagem de compartilhamento do site.</p>
      </div>

      <Card className="flex flex-wrap gap-2 p-4">
        <span className="text-sm text-secondary">Gerenciados nas suas próprias telas:</span>
        {RELATED_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-full bg-muted px-3 py-1 text-xs text-foreground hover:bg-accent/20"
          >
            {link.label}
          </Link>
        ))}
      </Card>

      <Tabs defaultValue="paginas">
        <TabsList>
          <TabsTrigger value="paginas">Páginas</TabsTrigger>
          <TabsTrigger value="geral">Geral</TabsTrigger>
        </TabsList>
        <TabsContent value="paginas">
          <PaginasTab />
        </TabsContent>
        <TabsContent value="geral">
          <GeralTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
