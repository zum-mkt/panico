import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { servicesCrud, listAllServicesAdmin } from "@/services/servicesService";
import { useReorder } from "@/hooks/useReorder";
import type { Service } from "@/types/service";
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
import { ServicoForm, type ServiceFormValues } from "./ServicoForm";

export function ServicosAdmin() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const queryKey = ["admin", "services"];
  const { data: services } = useQuery({ queryKey, queryFn: listAllServicesAdmin });
  const reorder = useReorder(servicesCrud, queryKey);

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const createMutation = useMutation({
    mutationFn: (values: ServiceFormValues) =>
      servicesCrud.create({ ...values, position: (services?.length ?? 0) + 1 }),
    onSuccess: () => {
      toast.success("Serviço criado.");
      invalidate();
      setFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: ServiceFormValues) => servicesCrud.update(editing!.id, values),
    onSuccess: () => {
      toast.success("Serviço atualizado.");
      invalidate();
      setFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => servicesCrud.remove(id),
    onSuccess: () => {
      toast.success("Serviço removido.");
      invalidate();
    },
  });

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(s: Service) {
    setEditing(s);
    setFormOpen(true);
  }

  const list = services ?? [];

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-primary">Serviços</h1>
          <p className="text-secondary">Cards exibidos na seção "Nossos serviços" da Home.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> Novo serviço
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Ícone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((service, i) => (
            <TableRow key={service.id}>
              <TableCell>{service.title}</TableCell>
              <TableCell>{service.icon || "—"}</TableCell>
              <TableCell>
                <Badge variant={service.is_active ? "default" : "secondary"}>
                  {service.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  disabled={i === 0}
                  onClick={() => reorder.mutate({ a: service, b: list[i - 1] })}
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  disabled={i === list.length - 1}
                  onClick={() => reorder.mutate({ a: service, b: list[i + 1] })}
                >
                  <ArrowDown className="size-4" />
                </Button>
                <Button size="icon-sm" variant="ghost" onClick={() => openEdit(service)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Remover "${service.title}"?`)) deleteMutation.mutate(service.id);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ServicoForm
        open={formOpen}
        onOpenChange={setFormOpen}
        service={editing}
        submitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values) => (editing ? updateMutation.mutate(values) : createMutation.mutate(values))}
      />
    </div>
  );
}
