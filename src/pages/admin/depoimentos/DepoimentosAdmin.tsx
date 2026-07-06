import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Star } from "lucide-react";
import { toast } from "sonner";
import { testimonialsCrud, listAllTestimonialsAdmin } from "@/services/testimonialsService";
import { useReorder } from "@/hooks/useReorder";
import type { Testimonial } from "@/types/testimonial";
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
import { DepoimentoForm, type TestimonialFormValues } from "./DepoimentoForm";

export function DepoimentosAdmin() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const queryKey = ["admin", "testimonials"];
  const { data: testimonials } = useQuery({ queryKey, queryFn: listAllTestimonialsAdmin });
  const reorder = useReorder(testimonialsCrud, queryKey);

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const createMutation = useMutation({
    mutationFn: (values: TestimonialFormValues) =>
      testimonialsCrud.create({ ...values, position: (testimonials?.length ?? 0) + 1 }),
    onSuccess: () => {
      toast.success("Depoimento criado.");
      invalidate();
      setFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: TestimonialFormValues) => testimonialsCrud.update(editing!.id, values),
    onSuccess: () => {
      toast.success("Depoimento atualizado.");
      invalidate();
      setFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => testimonialsCrud.remove(id),
    onSuccess: () => {
      toast.success("Depoimento removido.");
      invalidate();
    },
  });

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(t: Testimonial) {
    setEditing(t);
    setFormOpen(true);
  }

  const list = testimonials ?? [];

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-primary">Depoimentos</h1>
          <p className="text-secondary">Exibidos na seção "Quem confia na Paníco" da Home.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> Novo depoimento
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Autor</TableHead>
            <TableHead>Depoimento</TableHead>
            <TableHead>Nota</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((testimonial, i) => (
            <TableRow key={testimonial.id}>
              <TableCell>{testimonial.author_name}</TableCell>
              <TableCell className="max-w-sm truncate">{testimonial.content}</TableCell>
              <TableCell className="flex items-center gap-1">
                {testimonial.rating ?? "—"} <Star className="size-3 text-accent" />
              </TableCell>
              <TableCell>
                <Badge variant={testimonial.is_active ? "default" : "secondary"}>
                  {testimonial.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  disabled={i === 0}
                  onClick={() => reorder.mutate({ a: testimonial, b: list[i - 1] })}
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  disabled={i === list.length - 1}
                  onClick={() => reorder.mutate({ a: testimonial, b: list[i + 1] })}
                >
                  <ArrowDown className="size-4" />
                </Button>
                <Button size="icon-sm" variant="ghost" onClick={() => openEdit(testimonial)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Remover depoimento de "${testimonial.author_name}"?`))
                      deleteMutation.mutate(testimonial.id);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DepoimentoForm
        open={formOpen}
        onOpenChange={setFormOpen}
        testimonial={editing}
        submitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values) => (editing ? updateMutation.mutate(values) : createMutation.mutate(values))}
      />
    </div>
  );
}
