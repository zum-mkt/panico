import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Plan } from "@/types/plan";

const schema = z.object({
  title: z.string().min(2, "Informe o título"),
  description: z.string().optional(),
  price: z.string().optional(),
  benefits: z.array(z.object({ value: z.string().min(1, "Obrigatório") })),
  is_featured: z.boolean(),
  is_active: z.boolean(),
  color: z.string().optional(),
  cta_label: z.string().optional(),
  cta_url: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export type PlanFormValues = z.infer<typeof schema>;

function toFormValues(p?: Plan | null): PlanFormValues {
  return {
    title: p?.title ?? "",
    description: p?.description ?? "",
    price: p?.price != null ? String(p.price) : "",
    benefits: (p?.benefits ?? []).map((value) => ({ value })),
    is_featured: p?.is_featured ?? false,
    is_active: p?.is_active ?? true,
    color: p?.color ?? "",
    cta_label: p?.cta_label ?? "",
    cta_url: p?.cta_url ?? "",
    seo_title: p?.seo_title ?? "",
    seo_description: p?.seo_description ?? "",
  };
}

export function PlanoForm({
  open,
  onOpenChange,
  plan,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: Plan | null;
  onSubmit: (values: PlanFormValues) => void;
  submitting?: boolean;
}) {
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(schema),
    values: toFormValues(plan),
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "benefits" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{plan ? "Editar plano" : "Novo plano"}</DialogTitle>
        </DialogHeader>

        <form id="plan-form" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" {...form.register("title")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" {...form.register("description")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Preço mensal (R$)</Label>
              <Input id="price" type="number" step="0.01" {...form.register("price")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Cor de destaque</Label>
              <Input id="color" type="color" {...form.register("color")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Benefícios</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input {...form.register(`benefits.${index}.value`)} />
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <X className="size-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })}>
              <Plus className="size-4" /> Adicionar benefício
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cta_label">Texto do botão (CTA)</Label>
              <Input id="cta_label" {...form.register("cta_label")} placeholder="Contratar" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_url">Link do botão</Label>
              <Input id="cta_url" {...form.register("cta_url")} placeholder="https://wa.me/..." />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="is_featured"
                checked={form.watch("is_featured")}
                onCheckedChange={(v) => form.setValue("is_featured", v)}
              />
              <Label htmlFor="is_featured">Destaque</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={form.watch("is_active")}
                onCheckedChange={(v) => form.setValue("is_active", v)}
              />
              <Label htmlFor="is_active">Ativo</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_title">SEO — Título</Label>
            <Input id="seo_title" {...form.register("seo_title")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo_description">SEO — Descrição</Label>
            <Textarea id="seo_description" {...form.register("seo_description")} />
          </div>
        </form>

        <DialogFooter>
          <Button type="submit" form="plan-form" disabled={submitting}>
            {submitting ? "Salvando…" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
