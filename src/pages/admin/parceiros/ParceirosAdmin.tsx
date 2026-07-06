import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { partnersCrud, listAllPartnersAdmin } from "@/services/partnersService";
import { useReorder } from "@/hooks/useReorder";
import type { Partner } from "@/types/partner";
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
import { ParceiroForm, type PartnerFormValues } from "./ParceiroForm";

export function ParceirosAdmin() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);

  const queryKey = ["admin", "partners"];
  const { data: partners } = useQuery({ queryKey, queryFn: listAllPartnersAdmin });
  const reorder = useReorder(partnersCrud, queryKey);

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const createMutation = useMutation({
    mutationFn: (values: PartnerFormValues) =>
      partnersCrud.create({ ...values, position: (partners?.length ?? 0) + 1 }),
    onSuccess: () => {
      toast.success("Parceiro criado.");
      invalidate();
      setFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: PartnerFormValues) => partnersCrud.update(editing!.id, values),
    onSuccess: () => {
      toast.success("Parceiro atualizado.");
      invalidate();
      setFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => partnersCrud.remove(id),
    onSuccess: () => {
      toast.success("Parceiro removido.");
      invalidate();
    },
  });

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(p: Partner) {
    setEditing(p);
    setFormOpen(true);
  }

  const list = partners ?? [];

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-primary">Parceiros</h1>
          <p className="text-secondary">Rede de vantagens exibida na Home.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> Novo parceiro
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((partner, i) => (
            <TableRow key={partner.id}>
              <TableCell>
                {partner.logo_url ? (
                  <img src={partner.logo_url} alt="" className="h-8" />
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell>{partner.name}</TableCell>
              <TableCell>
                <Badge variant={partner.is_active ? "default" : "secondary"}>
                  {partner.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  disabled={i === 0}
                  onClick={() => reorder.mutate({ a: partner, b: list[i - 1] })}
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  disabled={i === list.length - 1}
                  onClick={() => reorder.mutate({ a: partner, b: list[i + 1] })}
                >
                  <ArrowDown className="size-4" />
                </Button>
                <Button size="icon-sm" variant="ghost" onClick={() => openEdit(partner)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Remover "${partner.name}"?`)) deleteMutation.mutate(partner.id);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ParceiroForm
        open={formOpen}
        onOpenChange={setFormOpen}
        partner={editing}
        submitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values) => (editing ? updateMutation.mutate(values) : createMutation.mutate(values))}
      />
    </div>
  );
}
