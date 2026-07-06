import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { getSetting } from "@/services/homeService";
import { upsertSetting, uploadSiteAsset, uploadHeroImage } from "@/services/settingsService";
import { iconNames } from "@/lib/iconMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type SiteSettings = { logo_url?: string; favicon_url?: string; phone?: string; whatsapp?: string; address?: string; instagram?: string; facebook?: string };

type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  image_url: string;
  primary_label: string;
  primary_href: string;
  secondary_label: string;
  secondary_href: string;
};

type ShortcutItem = { label: string; href: string; icon: string };

type AboutContent = { title: string; text: string; image_url?: string };

type CemeteryTeaserContent = {
  eyebrow: string;
  title: string;
  description: string;
  cta_label: string;
};

type CtaContent = { title: string; description: string };

function SaveButton({ onClick, pending }: { onClick: () => void; pending: boolean }) {
  return (
    <Button onClick={onClick} disabled={pending}>
      {pending ? "Salvando…" : "Salvar"}
    </Button>
  );
}

function LogoTab() {
  const { data } = useQuery({ queryKey: ["settings", "site"], queryFn: () => getSetting<SiteSettings>("site") });
  const [values, setValues] = useState<SiteSettings>({});
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => upsertSetting("site", values),
    onSuccess: () => toast.success("Logo salva."),
  });

  async function handleLogo(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadSiteAsset(file);
      setValues((p) => ({ ...p, logo_url: url }));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <p className="text-sm text-secondary">
        Logo exibida no cabeçalho do site inteiro. Telefone, WhatsApp e redes sociais ficam em{" "}
        <Link to="/admin/configuracoes" className="text-primary underline">
          Configurações → Geral
        </Link>
        .
      </p>
      <div className="space-y-2">
        <Label>Logo</Label>
        <Input type="file" accept="image/*" onChange={(e) => handleLogo(e.target.files?.[0])} />
        {uploading && <p className="text-sm text-secondary">Enviando…</p>}
        {values.logo_url && <img src={values.logo_url} alt="" className="h-10" />}
      </div>
      <SaveButton onClick={() => mutation.mutate()} pending={mutation.isPending} />
    </div>
  );
}

function HeroTab() {
  const { data } = useQuery({ queryKey: ["settings", "home_hero"], queryFn: () => getSetting<HeroContent>("home_hero") });
  const [values, setValues] = useState<HeroContent>({
    eyebrow: "",
    title: "",
    description: "",
    image_url: "",
    primary_label: "",
    primary_href: "",
    secondary_label: "",
    secondary_href: "",
  });
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => upsertSetting("home_hero", values),
    onSuccess: () => toast.success("Hero salvo."),
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
        <Input value={values.eyebrow} onChange={(e) => setValues((p) => ({ ...p, eyebrow: e.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label>Título</Label>
        <Textarea value={values.title} onChange={(e) => setValues((p) => ({ ...p, title: e.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label>Descrição</Label>
        <Textarea
          value={values.description}
          onChange={(e) => setValues((p) => ({ ...p, description: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Imagem do Hero</Label>
        <Input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} />
        {uploading && <p className="text-sm text-secondary">Enviando…</p>}
        {values.image_url && <img src={values.image_url} alt="" className="h-32 rounded-card object-cover" />}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Botão principal — texto</Label>
          <Input
            value={values.primary_label}
            onChange={(e) => setValues((p) => ({ ...p, primary_label: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Botão principal — link</Label>
          <Input
            value={values.primary_href}
            onChange={(e) => setValues((p) => ({ ...p, primary_href: e.target.value }))}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Botão secundário — texto</Label>
          <Input
            value={values.secondary_label}
            onChange={(e) => setValues((p) => ({ ...p, secondary_label: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Botão secundário — link</Label>
          <Input
            value={values.secondary_href}
            onChange={(e) => setValues((p) => ({ ...p, secondary_href: e.target.value }))}
          />
        </div>
      </div>
      <SaveButton onClick={() => mutation.mutate()} pending={mutation.isPending} />
    </div>
  );
}

function AtalhosTab() {
  const { data } = useQuery({
    queryKey: ["settings", "home_shortcuts"],
    queryFn: () => getSetting<ShortcutItem[]>("home_shortcuts"),
  });
  const [items, setItems] = useState<ShortcutItem[]>([]);
  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => upsertSetting("home_shortcuts", items),
    onSuccess: () => toast.success("Atalhos salvos."),
  });

  function update(i: number, patch: Partial<ShortcutItem>) {
    setItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }
  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }
  function add() {
    setItems((prev) => [...prev, { label: "", href: "", icon: "HeartHandshake" }]);
  }
  function move(i: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = i + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[i], next[target]] = [next[target], next[i]];
      return next;
    });
  }

  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-sm text-secondary">
        Ícones e links exibidos logo abaixo do Hero, na barra de atalhos.
      </p>
      {items.map((item, i) => (
        <Card key={i} className="flex items-end gap-3 p-4">
          <div className="flex-1 space-y-2">
            <Label>Texto</Label>
            <Input value={item.label} onChange={(e) => update(i, { label: e.target.value })} />
          </div>
          <div className="flex-1 space-y-2">
            <Label>Link</Label>
            <Input value={item.href} onChange={(e) => update(i, { href: e.target.value })} />
          </div>
          <div className="w-36 space-y-2">
            <Label>Ícone</Label>
            <select
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={item.icon}
              onChange={(e) => update(i, { icon: e.target.value })}
            >
              {iconNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-1">
            <Button size="icon-sm" variant="ghost" disabled={i === 0} onClick={() => move(i, -1)}>
              <ArrowUp className="size-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              disabled={i === items.length - 1}
              onClick={() => move(i, 1)}
            >
              <ArrowDown className="size-4" />
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={() => remove(i)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        </Card>
      ))}
      <Button variant="outline" onClick={add}>
        <Plus className="size-4" /> Adicionar atalho
      </Button>
      <div>
        <SaveButton onClick={() => mutation.mutate()} pending={mutation.isPending} />
      </div>
    </div>
  );
}

function SobreTab() {
  const { data } = useQuery({ queryKey: ["settings", "about"], queryFn: () => getSetting<AboutContent>("about") });
  const [values, setValues] = useState<AboutContent>({ title: "", text: "", image_url: "" });
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => upsertSetting("about", values),
    onSuccess: () => toast.success("Seção Sobre salva."),
  });

  async function handleImage(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadSiteAsset(file);
      setValues((p) => ({ ...p, image_url: url }));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <div className="space-y-2">
        <Label>Título</Label>
        <Input value={values.title} onChange={(e) => setValues((p) => ({ ...p, title: e.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label>Texto</Label>
        <Textarea value={values.text} onChange={(e) => setValues((p) => ({ ...p, text: e.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label>Imagem (opcional)</Label>
        <Input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} />
        {uploading && <p className="text-sm text-secondary">Enviando…</p>}
        {values.image_url && <img src={values.image_url} alt="" className="h-32 rounded-card object-cover" />}
      </div>
      <SaveButton onClick={() => mutation.mutate()} pending={mutation.isPending} />
    </div>
  );
}

function CemiterioTab() {
  const { data } = useQuery({
    queryKey: ["settings", "home_cemetery_teaser"],
    queryFn: () => getSetting<CemeteryTeaserContent>("home_cemetery_teaser"),
  });
  const [values, setValues] = useState<CemeteryTeaserContent>({
    eyebrow: "",
    title: "",
    description: "",
    cta_label: "",
  });
  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => upsertSetting("home_cemetery_teaser", values),
    onSuccess: () => toast.success("Bloco do Cemitério salvo."),
  });

  return (
    <div className="max-w-xl space-y-4">
      <p className="text-sm text-secondary">
        Bloco de destaque do Cemitério Parque exibido na Home. Para editar o restante da página do
        Cemitério, use o módulo{" "}
        <Link to="/admin/cemiterio" className="text-primary underline">
          Cemitério
        </Link>
        .
      </p>
      <div className="space-y-2">
        <Label>Texto de destaque (eyebrow)</Label>
        <Input value={values.eyebrow} onChange={(e) => setValues((p) => ({ ...p, eyebrow: e.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label>Título</Label>
        <Input value={values.title} onChange={(e) => setValues((p) => ({ ...p, title: e.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label>Descrição</Label>
        <Textarea
          value={values.description}
          onChange={(e) => setValues((p) => ({ ...p, description: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Texto do botão</Label>
        <Input
          value={values.cta_label}
          onChange={(e) => setValues((p) => ({ ...p, cta_label: e.target.value }))}
        />
      </div>
      <SaveButton onClick={() => mutation.mutate()} pending={mutation.isPending} />
    </div>
  );
}

function CtaTab() {
  const { data } = useQuery({ queryKey: ["settings", "home_cta"], queryFn: () => getSetting<CtaContent>("home_cta") });
  const [values, setValues] = useState<CtaContent>({ title: "", description: "" });
  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => upsertSetting("home_cta", values),
    onSuccess: () => toast.success("CTA final salvo."),
  });

  return (
    <div className="max-w-xl space-y-4">
      <p className="text-sm text-secondary">
        Telefone e WhatsApp usados nos botões vêm de{" "}
        <Link to="/admin/configuracoes" className="text-primary underline">
          Configurações → Geral
        </Link>
        .
      </p>
      <div className="space-y-2">
        <Label>Título</Label>
        <Input value={values.title} onChange={(e) => setValues((p) => ({ ...p, title: e.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label>Descrição</Label>
        <Textarea
          value={values.description}
          onChange={(e) => setValues((p) => ({ ...p, description: e.target.value }))}
        />
      </div>
      <SaveButton onClick={() => mutation.mutate()} pending={mutation.isPending} />
    </div>
  );
}

const COLLECTION_LINKS = [
  { label: "Serviços", to: "/admin/servicos" },
  { label: "Planos", to: "/admin/planos" },
  { label: "Obituários recentes", to: "/admin/obituarios" },
  { label: "Parceiros", to: "/admin/parceiros" },
  { label: "Depoimentos", to: "/admin/depoimentos" },
  { label: "Perguntas frequentes", to: "/admin/faq" },
];

export function HomeAdmin() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-heading text-2xl text-primary">Home</h1>
        <p className="text-secondary">Conteúdo da página inicial do site.</p>
      </div>

      <Card className="flex flex-wrap gap-2 p-4">
        <span className="text-sm text-secondary">Outras seções da Home têm tela própria:</span>
        {COLLECTION_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-full bg-muted px-3 py-1 text-xs text-foreground hover:bg-accent/20"
          >
            {link.label}
          </Link>
        ))}
      </Card>

      <Tabs defaultValue="logo">
        <TabsList>
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="atalhos">Atalhos</TabsTrigger>
          <TabsTrigger value="sobre">Sobre</TabsTrigger>
          <TabsTrigger value="cemiterio">Cemitério</TabsTrigger>
          <TabsTrigger value="cta">CTA final</TabsTrigger>
        </TabsList>
        <TabsContent value="logo">
          <LogoTab />
        </TabsContent>
        <TabsContent value="hero">
          <HeroTab />
        </TabsContent>
        <TabsContent value="atalhos">
          <AtalhosTab />
        </TabsContent>
        <TabsContent value="sobre">
          <SobreTab />
        </TabsContent>
        <TabsContent value="cemiterio">
          <CemiterioTab />
        </TabsContent>
        <TabsContent value="cta">
          <CtaTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
