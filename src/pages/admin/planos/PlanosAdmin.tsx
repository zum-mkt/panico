import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Star } from "lucide-react";
import { toast } from "sonner";
import { listAllPlansAdmin, plansCrud, swapPlanPosition } from "@/services/plansService";
import { getSetting } from "@/services/homeService";
import { upsertSetting, uploadHeroImage } from "@/services/settingsService";
import type { Plan } from "@/types/plan";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlanoForm, type PlanFormValues } from "./PlanoForm";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

type PlanosHeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  image_url: string;
  primary_label: string;
};

function toPayload(values: PlanFormValues) {
  return {
    ...values,
    price: values.price ? Number(values.price) : null,
    benefits: values.benefits.map((b) => b.value),
  };
}

function PlanosHeroTab() {
  const { data } = useQuery({
    queryKey: ["settings", "planos_hero"],
    queryFn: () => getSetting<PlanosHeroContent>("planos_hero"),
  });
  const [values, setValues] = useState<PlanosHeroContent>({
    eyebrow: "Planos",
    title: "Proteção completa para você e sua família",
    description: "Planos funerários com assistência 24h, sem burocracia na hora em que sua família mais precisa.",
    image_url: "",
    primary_label: "Falar com a equipe",
  });
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => upsertSetting("planos_hero", values),
    onSuccess: () => toast.success("Hero da página salvo."),
  });

  async function handleImage(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      setValues((p) => ({ ...p, image_url: await uploadHeroImage(file) }));
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
          value={values.primary_label}
          onChange={(e) => setValues((p) => ({ ...p, primary_label: e.target.value }))}
        />
      </div>
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? "Salvando…" : "Salvar"}
      </Button>
    </div>
  );
}

export function PlanosAdmin() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);

  const { data: plans } = useQuery({ queryKey: ["admin", "plans"], queryFn: listAllPlansAdmin });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });

  const createMutation = useMutation({
    mutationFn: (values: PlanFormValues) =>
      plansCrud.create({ ...toPayload(values), position: (plans?.length ?? 0) + 1 }),
    onSuccess: () => {
      toast.success("Plano criado.");
      invalidate();
      setFormOpen(false);
    },
    onError: () => toast.error("Erro ao criar plano."),
  });

  const updateMutation = useMutation({
    mutationFn: (values: PlanFormValues) => plansCrud.update(editing!.id, toPayload(values)),
    onSuccess: () => {
      toast.success("Plano atualizado.");
      invalidate();
      setFormOpen(false);
    },
    onError: () => toast.error("Erro ao atualizar plano."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => plansCrud.remove(id),
    onSuccess: () => {
      toast.success("Plano removido.");
      invalidate();
    },
  });

  const reorderMutation = useMutation({
    mutationFn: ({ a, b }: { a: Plan; b: Plan }) => swapPlanPosition(a, b),
    onSuccess: invalidate,
  });

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(p: Plan) {
    setEditing(p);
    setFormOpen(true);
  }

  const list = plans ?? [];

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-heading text-2xl text-primary">Planos</h1>
        <p className="text-secondary">Gerencie os planos funerários exibidos no site.</p>
      </div>

      <Tabs defaultValue="planos">
        <TabsList>
          <TabsTrigger value="planos">Planos</TabsTrigger>
          <TabsTrigger value="hero">Hero da página</TabsTrigger>
        </TabsList>
        <TabsContent value="hero">
          <PlanosHeroTab />
        </TabsContent>
        <TabsContent value="planos" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={openCreate}>
              <Plus className="size-4" /> Novo plano
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordem</TableHead>
                <TableHead></TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((plan, i) => (
                <TableRow key={plan.id}>
                  <TableCell className="flex gap-1">
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      disabled={i === 0}
                      onClick={() => reorderMutation.mutate({ a: plan, b: list[i - 1] })}
                    >
                      <ArrowUp className="size-3.5" />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      disabled={i === list.length - 1}
                      onClick={() => reorderMutation.mutate({ a: plan, b: list[i + 1] })}
                    >
                      <ArrowDown className="size-3.5" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    {plan.image_url && (
                      <img src={plan.image_url} alt="" className="h-8 w-12 rounded object-cover" />
                    )}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    {plan.title}
                    {plan.is_featured && <Star className="size-3.5 fill-accent text-accent" />}
                  </TableCell>
                  <TableCell>{plan.price != null ? currency.format(plan.price) : "—"}</TableCell>
                  <TableCell>
                    <Badge variant={plan.is_active ? "default" : "secondary"}>
                      {plan.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button size="icon-sm" variant="ghost" onClick={() => openEdit(plan)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Remover "${plan.title}"?`)) deleteMutation.mutate(plan.id);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PlanoForm
            key={editing?.id ?? "new"}
            open={formOpen}
            onOpenChange={setFormOpen}
            plan={editing}
            submitting={createMutation.isPending || updateMutation.isPending}
            onSubmit={(values) => (editing ? updateMutation.mutate(values) : createMutation.mutate(values))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
