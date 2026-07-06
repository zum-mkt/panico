import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { formsCrud, listAllFormsAdmin } from "@/services/formsService";
import type { DynamicForm } from "@/types/form";
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
import { FormBuilder } from "./FormBuilder";
import { SubmissionsDialog } from "./SubmissionsDialog";

export function FormulariosAdmin() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DynamicForm | null>(null);
  const [viewingSubmissions, setViewingSubmissions] = useState<DynamicForm | null>(null);

  const { data: forms } = useQuery({ queryKey: ["admin", "forms"], queryFn: listAllFormsAdmin });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "forms"] });

  const createMutation = useMutation({
    mutationFn: (values: Parameters<typeof formsCrud.create>[0]) => formsCrud.create(values),
    onSuccess: () => {
      toast.success("Formulário criado.");
      invalidate();
      setFormOpen(false);
    },
    onError: () => toast.error("Erro ao criar (verifique se o slug já existe)."),
  });

  const updateMutation = useMutation({
    mutationFn: (values: Parameters<typeof formsCrud.update>[1]) =>
      formsCrud.update(editing!.id, values),
    onSuccess: () => {
      toast.success("Formulário atualizado.");
      invalidate();
      setFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => formsCrud.remove(id),
    onSuccess: () => {
      toast.success("Formulário removido.");
      invalidate();
    },
  });

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(f: DynamicForm) {
    setEditing(f);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-primary">Formulários</h1>
          <p className="text-secondary">
            Crie formulários com campos personalizados. Use <code>DynamicFormRenderer</code> com
            o slug em qualquer página para exibi-lo.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> Novo formulário
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Campos</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(forms ?? []).map((f) => (
            <TableRow key={f.id}>
              <TableCell>{f.title}</TableCell>
              <TableCell className="font-mono text-sm">{f.slug}</TableCell>
              <TableCell>{f.fields.length}</TableCell>
              <TableCell>
                <Badge variant={f.is_active ? "default" : "secondary"}>
                  {f.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button size="icon-sm" variant="ghost" onClick={() => setViewingSubmissions(f)}>
                  <Inbox className="size-4" />
                </Button>
                <Button size="icon-sm" variant="ghost" onClick={() => openEdit(f)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Remover "${f.title}"?`)) deleteMutation.mutate(f.id);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <FormBuilder
        open={formOpen}
        onOpenChange={setFormOpen}
        form={editing}
        submitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values) =>
          editing ? updateMutation.mutate(values) : createMutation.mutate(values)
        }
      />

      {viewingSubmissions && (
        <SubmissionsDialog
          form={viewingSubmissions}
          open={!!viewingSubmissions}
          onOpenChange={() => setViewingSubmissions(null)}
        />
      )}
    </div>
  );
}
