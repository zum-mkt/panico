import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { faqCrud, listFaqAdmin } from "@/services/faqService";
import { useReorder } from "@/hooks/useReorder";
import type { Faq } from "@/types/faq";
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
import { FaqForm, type FaqFormValues } from "./FaqForm";

const CONTEXT = "home";

export function FaqAdmin() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);

  const queryKey = ["admin", "faq", CONTEXT];
  const { data: faqs } = useQuery({ queryKey, queryFn: () => listFaqAdmin(CONTEXT) });
  const reorder = useReorder(faqCrud, queryKey);

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const createMutation = useMutation({
    mutationFn: (values: FaqFormValues) =>
      faqCrud.create({ ...values, position: (faqs?.length ?? 0) + 1 }),
    onSuccess: () => {
      toast.success("Pergunta criada.");
      invalidate();
      setFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: FaqFormValues) => faqCrud.update(editing!.id, values),
    onSuccess: () => {
      toast.success("Pergunta atualizada.");
      invalidate();
      setFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => faqCrud.remove(id),
    onSuccess: () => {
      toast.success("Pergunta removida.");
      invalidate();
    },
  });

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(f: Faq) {
    setEditing(f);
    setFormOpen(true);
  }

  const list = faqs ?? [];

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-primary">Perguntas frequentes</h1>
          <p className="text-secondary">Exibidas na seção FAQ da Home.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> Nova pergunta
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pergunta</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((faq, i) => (
            <TableRow key={faq.id}>
              <TableCell className="max-w-md truncate">{faq.question}</TableCell>
              <TableCell>
                <Badge variant={faq.is_active ? "default" : "secondary"}>
                  {faq.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  disabled={i === 0}
                  onClick={() => reorder.mutate({ a: faq, b: list[i - 1] })}
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  disabled={i === list.length - 1}
                  onClick={() => reorder.mutate({ a: faq, b: list[i + 1] })}
                >
                  <ArrowDown className="size-4" />
                </Button>
                <Button size="icon-sm" variant="ghost" onClick={() => openEdit(faq)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm("Remover esta pergunta?")) deleteMutation.mutate(faq.id);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <FaqForm
        open={formOpen}
        onOpenChange={setFormOpen}
        faq={editing}
        defaultContext={CONTEXT}
        submitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values) => (editing ? updateMutation.mutate(values) : createMutation.mutate(values))}
      />
    </div>
  );
}
