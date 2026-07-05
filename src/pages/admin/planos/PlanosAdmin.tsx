import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Star } from "lucide-react";
import { toast } from "sonner";
import { listAllPlansAdmin, plansCrud, swapPlanPosition } from "@/services/plansService";
import type { Plan } from "@/types/plan";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

function toPayload(values: PlanFormValues) {
  return {
    ...values,
    price: values.price ? Number(values.price) : null,
    benefits: values.benefits.map((b) => b.value),
  };
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-primary">Planos</h1>
          <p className="text-secondary">Gerencie os planos funerários exibidos no site.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> Novo plano
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ordem</TableHead>
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
        open={formOpen}
        onOpenChange={setFormOpen}
        plan={editing}
        submitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values) => (editing ? updateMutation.mutate(values) : createMutation.mutate(values))}
      />
    </div>
  );
}
